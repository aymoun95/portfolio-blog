---
title: "Understanding the JavaScript Event Loop in the Browser and Node.js"
publishedAt: "2025-11-17"
summary: "A deep yet accessible guide to how the JavaScript event loop works in both browser and Node.js environments, covering microtasks, macrotasks, libuv phases, and real-world examples."
tags: ["javascript", "event-loop", "browser", "nodejs"]
image: "https://i.ibb.co/rGJLrrfS/event-loop.jpg"
---

JavaScript is single-threaded — it executes one piece of code at a time. Yet somehow, it handles timers, network requests, user interactions, file I/O, and more without blocking.  
The secret behind this magic is the **Event Loop**.

In this blog, we’ll explore:

- What the event loop is
- How it works in **browser environments**
- How it works in **Node.js**
- The differences between the two
- Practical examples you can use today

---

## 1. What Exactly Is the Event Loop?

The Event Loop is the mechanism that:

1. Runs your JavaScript code on a single thread
2. Delegates async tasks (timers, fetch, I/O) to the environment
3. Handles callbacks when tasks are ready
4. Determines the order of execution between microtasks and macrotasks

Think of it as the “traffic controller” deciding what executes next. And one misconception about it
is that a lot think that the event loop is the same in the Browser as in Node.

---

## 2. The Event Loop in the Browser

The browser environment consists of:

- **Call Stack**
- **Web APIs** (DOM, fetch, timers…)
- **Task Queue** (macrotasks)
- **Microtask Queue** (Promises, `MutationObserver`)
- **Rendering Pipeline**

### How the Loop Works

1. Synchronous code runs on the **call stack**.
2. When a long-running or async operation (like `setTimeout` or `fetch`) is called, it's handed off to the browser’s Web APIs.
3. Once those operations complete, their callbacks are queued — either in the **macrotask queue** (for things like `setTimeout`) or in the **microtask queue** (for promises).
4. After the call stack is empty, the event loop first drains the **microtask queue**.
5. Then it performs a **render**, if necessary.
6. Finally, it dequeues one macrotask and executes it, then repeats.

Microtasks always have priority **before** rendering and before macrotasks.

### Visual Diagram (Browser)

![Browser Event Loop Diagram](/images/blogs/event-loop/browser.jpg)

> _Image source: GeeksforGeeks_

### Example

```js
console.log("1");

setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("2");
```

**Browser output:**

```text
1
2
promise
timeout
```

---

## 3. The Event Loop in Node.js

Node.js also uses an event-driven architecture but depends on **libuv**, a C library that provides:

- Thread pool
- I/O event handling
- Timers
- Networking

Node’s event loop runs through **six phases**, each responsible for specific kinds of callbacks.

### Visual Diagram (Node)

![Node.js Event Loop Diagram](/images/blogs/event-loop/node.avif)

> Image source: LogRocket

### Node.js Event Loop Phases

1. **Timers Phase** — Executes callbacks from `setTimeout`, `setInterval`
2. **Pending Callbacks Phase** — Executes system-level callbacks
3. **Idle / Prepare Phase** — Internal use
4. **Poll Phase** — Retrieves new I/O events, executes I/O callbacks, may block
5. **Check Phase** — Executes `setImmediate` callbacks
6. **Close Callbacks Phase** — Executes “close” events (e.g. `socket.on('close')`)

### How the loop works in Node (Execution Order from image)

## Event Loop - Execution Order

1. Any callbacks in the micro task queues are executed. First, tasks in the nextTick queue and only then tasks in the promise queue
2. All callbacks within the timer queue are executed
3. Callbacks in the micro task queues if present are executed. Again, first tasks in the nextTick queue and then tasks in the promise queue
4. All callbacks within the I/O queue are executed
5. Callbacks in the micro task queues if present are executed. nextTick queue followed by Promise queue.
6. All callbacks in the check queue are executed
7. Callbacks in the micro task queues if present are executed. Again, first tasks in the nextTick queue and then tasks in the promise queue
8. All callbacks in the close queue are executed
9. For one final time in the same loop, the micro task queues are executed. nextTick queue followed by promise queue.

> For more in depth: **[Codevolution youtube channel](https://www.youtube.com/watch?v=L18RHG2DwwA)**

### Microtasks in Node.js

Node.js processes microtasks:

- **After each phase**, not only after the call stack is empty
- With `process.nextTick()` having _higher priority_ than Promise microtasks

---

## Node.js Example

```js
console.log("1");

setTimeout(() => {
  console.log("timeout");
}, 0);

setImmediate(() => {
  console.log("immediate");
});

Promise.resolve().then(() => {
  console.log("promise");
});

process.nextTick(() => {
  console.log("nextTick");
});

console.log("2");
```

**Typical Node.js output:**

```text
1
2
nextTick
promise
timeout
immediate
```

---

## 5. Real-World Implications

### ✔ Performance Optimization

Too many microtasks can block rendering (browser) or delay timers (Node.js).

### ✔ Debugging Async Behavior

Understanding phases and queues helps solve “why is this running before that?” situations.

---

## 6. Conclusion

The JavaScript Event Loop is the engine behind non-blocking behavior in both browsers and Node.js.
Mastering its phases, queues, and priorities gives you the ability to:

- Debug async behavior predictably
- Improve performance
- Write more reliable JavaScript apps

### 🔄 Try the Event Loop Visualizer (Loupe)

Experiment with the event loop visually here: **[Event Loop Visualizer](http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D)**
