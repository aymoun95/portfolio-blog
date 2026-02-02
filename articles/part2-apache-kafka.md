---
title: "Part 2: Building a Real-Time Event-Driven E-Commerce Platform with Apache Kafka"
publishedAt: "2026-02-02"
summary: "A deep dive into an event-driven e-commerce architecture using Apache Kafka, choreography-based Sagas, and Server-Sent Events for real-time updates."
tags:
  [
    "kafka",
    "event-driven",
    "microservices",
    "saga",
    "sse",
    "ecommerce",
    "react",
    "typescript",
  ]
image: "https://i.ibb.co/Ng8fq8Jn/kafka-part2.webp"
---

A deep dive into building "The Boutique," a full-stack e-commerce system that uses **Apache Kafka** to orchestrate asynchronous microservices, a **Choreography-based Saga** pattern for critical transactions, and **Server-Sent Events (SSE)** for real-time frontend updates.

This guide will walk through the architecture, the specific Kafka implementation, and how we leveraged events to create a responsive, decoupled system.

<Video src="/images/blogs/kafka/kafka.mp4" />

---

## 1. The Distributed Architecture

Instead of a monolithic backend, we split the system into specialized, loosely coupled services:

- **Auth Service**: Handles user authentication for secure access.
- **Products Service**: Manages product inventory, details, and availability.
- **Orders Service**: Manages order lifecycles and maintains the "Source of Truth" for system state.
- **Expiration Service**: A specialized worker that handles time-sensitive tasks (order timeouts).
- **Payments Service**: Processes transactions and emits completion events.
- **Client**: A React 19 application that reacts to state changes instantly.

### Why Kafka?

We chose Apache Kafka as our backbone because:

1.  **Decoupling**: Services don't know about each other; they only know about _events_.
2.  **Durability**: Events are persisted, allowing services to replay history if they crash.
3.  **Scalability**: We can add multiple consumers for the same topic.

---

## 2. Visualization: The Order Saga Flow

Before diving into the code, let's visualize exactly how an Order travels through our system, from creation to automatic expiration.

![Sequence Diagram](/images/blogs/kafka/sequence-diagram.png)

---

## 3. Implementing the "Saga Pattern" with Code

Now let's look at the actual code that powers each step of this diagram.

### Step A: Publishing the Event (The Trigger)

When the user hits checkout, the **Orders Service** persists the order and immediately announces it to the world.

```typescript
// 1. Save to database (in-memory for this demo)
const order = { id: uuid(), status: 'created', ... };

// 2. Publish to Kafka
// We use a specific topic 'order-created' that other services listen to
await producer.send({
    topic: 'order-created',
    messages: [{
        value: JSON.stringify({
            id: order.id,
            expiresAt: order.expiresAt
        })
    }]
});
```

_Impact_: The Orders Service is now "done" with the creation request. It doesn't wait for the timer. This makes the checkout API extremely fast.

### Step B: The Consumer (The Worker)

The **Expiration Service** is sleeping until it hears that event. It subscribes to the topic and defines what to do.

```typescript
await consumer.run({
  eachMessage: async ({ topic, message }: any) => {
    const data = JSON.parse(message.value.toString());

    if (topic === "order-created") {
      console.log(`Received order ${data.id}. Starting timer...`);

      // Call the service logic to handle the delay
      await expirationService.startTimer(data.id);
    }
  },
});
```

### Step C: The Timer Logic (The Delay)

Here is where the actual "waiting" happens. We use a native timeout to simulate the delay. When it finishes, we don't update the database directly (we don't own the Order DB!). Instead, we emit _another_ event.

```typescript
export class ExpirationService {
  async startTimer(orderId: string, delay: number = 15000) {
    // The delay happens here, asynchronously
    const timeout = setTimeout(async () => {
      // TIMER FINISHED!
      // We don't cancel the order here. We just say "It's time".
      // This keeps the Expiration Service decoupled from Order logic.
      await producer.send({
        topic: "expiration-complete",
        messages: [{ value: JSON.stringify({ orderId }) }],
      });
    }, delay);

    tasks[orderId] = timeout;
  }
}
```

### Step D: Closing the Loop (The Update)

Finally, the **Orders Service** needs to know that the time is up so it can officially cancel the order. It listens for the `expiration-complete` event.

```typescript
if (topic === "expiration-complete") {
  console.log(`Time is up for order ${data.orderId}. Cancelling...`);

  // 1. Update the 'Source of Truth'
  await orderService.updateStatus(data.orderId, "cancelled");

  // 2. Notify the Frontend immediately
  // This is the "Real-time" aspect explaining last step in the diagram
  if (order) {
    sendToUser(order.userId, {
      orderId: data.orderId,
      status: "cancelled",
    });
  }
}
```

---

### Step E: Inventory Management (The Side Effect)

When a payment is successful, we also need to update our inventory. The **Products Service** listens for the same `payment-created` event to decrement stock.

```typescript
if (topic === "payment-created") {
  // 1. Retrieve the products associated with this order
  const productIds = orderProductMap.get(data.orderId);

  if (productIds) {
    console.log(`Reducing stock for order ${data.orderId}`);

    // 2. Update the inventory database
    await productService.decreaseStock(productIds);

    // 3. Clean up temporary state
    orderProductMap.delete(data.orderId);
  }
}
```

This ensures that even if the Client crashes or the Payment Service is busy, our inventory eventually becomes consistent.

> **Note**: For the sake of simplicity in this demo, we assume each order contains only one unit of each product. In a real-world scenario, you would track specific quantities for every item in the cart.

---

## 4. Closing the Loop: Real-Time SSE Updates

Kafka handled the server-side communication perfectly. But the user is on a browser. How do we tell them?

We skip the database polling and push the update directly via **Server-Sent Events (SSE)**.

```typescript
useEffect(() => {
  // Open a persistent connection to the server
  const eventSource = new EventSource(
    `http://localhost:3002/api/orders/events?userId=${currentUser.id}`,
  );

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);

    setOrders((prevOrders) => {
      const order = prevOrders.find((o) => o.id === data.orderId);
      if (!order) return prevOrders;

      // Handle specific status changes (e.g., expiration or payment)
      if (data.status === "cancelled") {
        onOrderExpired(order); // Triggers the notification
      } else if (data.status === "completed") {
        onOrderCompleted(order);
      }

      // Update local state instantly
      return prevOrders.map((o) =>
        o.id === data.orderId ? { ...o, status: data.status } : o,
      );
    });
  };

  return () => eventSource.close();
}, []);
```

---

## Conclusion

This architecture demonstrates the power of **Event-Driven Design**:

1.  **Auth & Products** provided secure access and inventory management without direct coupling.
2.  **Orders Service** started the process but didn't handle the timer.
3.  **Expiration Service** handled the timer but didn't touch the order database.
4.  **Kafka** glued them together reliably.
5.  **React + SSE** kept the user in the loop without refreshing.

We essentially built a distributed state machine where each service—**Auth**, **Products**, **Orders**, **Payments**, and **Expiration**—owns a specific part of the transition logic, resulting in a system that is robust, scalable, and easy to extend.

---

### A Note on the API Gateway

You may have noticed that our client calls services directly (`localhost:3002`, etc.) in this implementation. In a production environment, this is not ideal. A simpler and more secure approach is to implement an **API Gateway**.

The Gateway would act as a single entry point for all client requests, handling routing (e.g., `/api/orders` -> Orders Service, `/api/payments` -> Payments Service), authentication validation, and rate limiting. I’ve left this part as an exercise for you to implement—it’s the perfect next step to take this architecture to production-grade!

---

## 🏁 Links

- **Source Code:** [https://github.com/aymoun95/kafka-microservices](https://github.com/aymoun95/kafka-microservices)

Happy hacking and happy learning! 🚀
