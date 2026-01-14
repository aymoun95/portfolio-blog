---
title: "Exploring Real-Time Communication Protocols: Short Polling, Long Polling, SSE, and WebSockets"
publishedAt: "2026-01-14"
summary: "A breakdown of different communication protocols for real-time apps and how they work, with code examples."
tags: ["websockets", "polling", "sse", "real-time", "communication protocols"]
image: "https://i.ibb.co/CKTx6DLx/realtime.jpg"
---

Imagine you're building a chat app. You want to see messages the moment they're sent. How does the server tell your browser, "Hey, there's a new message!"?

In the traditional web, browsers ask and servers answer. But for real-time apps, we need something more. This project, the **Communication Protocols Lab**, is a hands-on sandbox where you can see five common **real-time communication patterns**: **Short Polling**, **Long Polling**, **Server-Sent Events (SSE)**, **WebSockets**, adn **Webhooks**.

Let's break them down simple mental models and real code from the lab.

---

## 1. Short Polling: The "Are we there yet?" Approach

**Short Polling** is the simplest way to get "real-time" updates. The browser sends a request every N seconds asking: “Any updates?”.

- **The Analogy:** Imagine a kid in the back of a car asking "Are we there yet?" every 30 seconds.
- **Client side:** We repeatedly `fetch` the server state using `setInterval`.

  ```typescript
  // client/src/components/short-polling.tsx

  intervalRef.current = setInterval(async () => {
    const res = await fetch(`${API_BASE_URL}/short-poll`);
    const data = await res.json();
    setLogs((l) => [...l, data]);

    if (data.status === "done") stop(); // Stop polling when job is finished
  }, 2000);
  ```

- **Server side:** The server just checks the current state and returns a response immediately.

  ```typescript
  // server/src/routes/short-polling.ts
  router.get("/", (req, res) => {
    attempts++;
    if (attempts <= 3) {
      return res.json({ status: "processing" }); // Not ready yet...
    }
    res.json({ status: "done", result: "Job finished 🎉" }); // Finally ready!
  });
  ```

  🎥 **Short Polling:**

  <Video src="/images/blogs/communication-protocols/short-polling.mp4" />

- ### ✅ Pros
  - Extremely simple to implement.
  - Works with almost any server setup.
- ### ❌ Cons
  - Very inefficient. Most requests return "no new data."
  - Heavy on server resources and battery life.

---

## 2. Long Polling: The "I'll wait here" Approach

**Long Polling** is a smarter version. The browser sends a request, but the server **holds it open** until it actually has new data to send.

- **The Analogy:** Like sitting in a pizza place waiting for your order. You don't ask every minute; you just wait until the waiter brings it.
- **Client side:** Notice how there is no `setInterval`. We just make a request and wait.
  ```typescript
  // client/src/components/long-polling.tsx
  async function start() {
    const res = await fetch(`${API_BASE_URL}/long-poll`);
    const data = await res.json(); // This line "hangs" until server responds
    setMessages((m) => [...m, data]);
  }
  ```
- **Server side:** We use a `setTimeout` to delay the response until something happens.

  ```typescript
  // server/src/routes/long-polling.ts
  router.get("/", async (req, res) => {
    // Wait for 5 seconds before responding (simulating a slow task)
    await new Promise((r) => setTimeout(r, 5000));
    res.json({ status: "done", at: Date.now() });
  });
  ```

  > ⚠️ In real systems, this delay is usually triggered by a DB event, message queue, or job completion — not a timeout.

🎥 **Long Polling:**

<Video src="/images/blogs/communication-protocols/long-polling.mp4" />

- ### ✅ Pros
  - More efficient than short polling (fewer empty responses).
  - Near real-time.
- ### ❌ Cons
  - Server must manage many "hanging" connections, which can be memory-intensive.

---

## 3. Server-Sent Events (SSE): The "Radio Station"

**SSE** allows the server to "push" updates to the browser over a single, long-lived HTTP connection. It's strictly **one-way**: Server to Client.

- **The Analogy:** Like a radio station. You tune in, and the station broadcasts music whenever they want.
- **Client side:** We use the built-in `EventSource` API.
  ```typescript
  // client/src/components/sse.tsx
  const es = new EventSource(`${API_BASE_URL}/sse`);
  es.onmessage = (e) => {
    const data = JSON.parse(e.data);
    setEvents((ev) => [...ev, data]);
  };
  ```
- **Server side:** The server keeps the connection alive and streams messages. We set specific headers to keep the connection alive.

  ```typescript
  // server/src/routes/sse.ts
  router.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");

    const id = setInterval(() => {
      res.write(`data: ${JSON.stringify({ count })}\n\n`); // Push data
    }, 1000);
  });
  ```

  🎥 **SSE:**
  <Video src="/images/blogs/communication-protocols/sse.mp4" />

- ### ✅ Pros
  - Very lightweight and uses standard HTTP.
  - Automatic reconnection built-in.
  - Excellent for notifications, feeds, dashboards
- ### ❌ Cons
  - One-way only (Uni-directional).
  - Not supported by older browsers (mostly legacy IE)

---

## 4. WebSockets: The "Full-Duplex" Telephone Call

**WebSockets** provide a "full-duplex" connection, meaning both sides talk to each other at the same time over one connection.

- **The Analogy:** A phone call. Either person can speak whenever they want.
- **Client side:** We usually use a library like `socket.io` for reliability and fallbacks.

  ```typescript
  // client/src/components/ws.tsx
  const socket = io(API_BASE_URL);

  // Listen for messages
  socket.on("chat message", (msg) => {
    setMessages((m) => [...m, msg]);
  });

  // Send messages
  function send() {
    socket.emit("chat message", input);
  }
  ```

- **Server side:**

  ```typescript
  // server/src/routes/ws.ts
  io.on("connection", (socket) => {
    socket.on("chat message", (msg) => {
      io.emit("chat message", msg); // Broadcast to EVERYONE
    });
  });
  ```

  🎥 **WebSockets:**
  <Video src="/images/blogs/communication-protocols/socket.mp4" />

- ### ✅ Pros
  - Lowest latency, bi-directional, and very low overhead.
  - Best for high-speed interaction.
  - Ideal for chat, games, collaboration tools.
  - Check my [Collaborative BPMN Editor](https://aymenbenzlaouia.vercel.app/blog/realtime-bpmn-editor) for a real world example.
- ### ❌ Cons
  - Slightly more complex to scale.

---

## 5. Webhooks: The "Call Me Back" System

Wait, there's one more! While the first four protocols are about how a **browser** and a **server** talk, **Webhooks** are usually how two **servers** talk to each other.

- **The Analogy:** Instead of you checking your mailbox every day (Polling), or waiting by the door (WebSockets), you leave your phone number with a friend and say, "Hey, call me when the package arrives." You don't do anything until your phone rings.

- **Real-World Example (In this project!):** We use a webhook to automate deployment. After **GitHub Actions** successfully builds and pushes our new Docker images, it triggers a "Deploy Hook" from **Render**. This tells Render: "Hey, the new version is ready! Come and get it." This is much more efficient than Render constantly polling GitHub for changes.

- ### ✅ Pros
  - Zero wasted resources. No requests happen until there is actually data.
  - Very easy to scale for the sender.
- ### ❌ Cons
  - Receiver must expose a public URL.
  - Difficult to test locally without tools like Ngrok.
- ### 🧪 Your Challenge

There’s a webhook route in:

```txt
/webhook
```

**Your task is to explore this yourself!**

- Can you figure out how to trigger it?
- Try using a tool like `curl` or Postman to send a POST request to the webhook route and watch the server logs!

---

## 📊 Comparison Table

| Feature         | Short Polling  | Long Polling       | SSE                   | WebSockets         |
| --------------- | -------------- | ------------------ | --------------------- | ------------------ |
| Communication   | Pull (One-way) | Pull (One-way)     | Push (One-way)        | Full Duplex        |
| Connection      | Many requests  | Long-lived request | Single HTTP stream    | Persistent socket  |
| Latency         | High           | Medium             | Low                   | Very Low           |
| Browser Support | Universal      | Universal          | Modern browsers       | Universal          |
| Best Use Case   | Simple polling | Legacy real-time   | Feeds / notifications | Chat / multiplayer |

---

## 🛠 Explore the Lab

1. **Start everything**

   ```bash
   docker-compose up --build
   ```

2. **Frontend**

   ```txt
   http://localhost:8080
   ```

3. **Open DevTools → Network**
   - Short Polling → repeated requests
   - Long Polling → long-duration request
   - SSE → `EventStream` with growing size
   - WebSockets → `WS` frames tab

---

## 🏁 Links

- **Source Code:** [https://github.com/aymoun95/protocol-lab](https://github.com/aymoun95/protocol-lab)
- **Live Frontend:** [https://protocol-lab.onrender.com](https://protocol-lab.onrender.com)
- **Live Backend:** [https://api-protocol-lab.onrender.com](https://api-protocol-lab.onrender.com)

> ℹ️ **Note:** The backend runs on Render’s free tier and may sleep.
> If something doesn’t respond, hit the backend health endpoint first to wake it up.

Happy hacking and happy learning! 🚀
