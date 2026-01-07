---
title: "Building a Real-Time Collaborative BPMN Editor with Locking in React and Node.js"
publishedAt: "2025-11-15"
summary: "Learn how to build a real-time collaborative BPMN editor with React, Node.js, and Socket.IO, featuring a live locking mechanism. Step-by-step code and architecture breakdown included."
tags: ["nodejs", "react", "socketio", "docker"]
image: "https://i.ibb.co/prWGCvR7/socket.png"
---

## What is BPMN?

**BPMN** (Business Process Model and Notation) is a graphical standard for representing business processes in a workflow. It uses flowcharts to visually depict the steps, decisions, and participants in a process, making it easier for both technical and business users to understand and communicate how work gets done.

BPMN diagrams are widely used for:

- Documenting business processes
- Automating workflows
- Improving communication between stakeholders

## Why Build a Collaborative BPMN Editor?

In modern organizations, process design is a team effort. A collaborative BPMN editor allows multiple users to:

- Edit the same diagram in real time
- See who else is online
- Prevent conflicting changes with a locking mechanism

In this blog, I'll show you how I built a real-time collaborative BPMN editor using React, Node.js, Socket.IO, and Docker. The full code is available on [GitHub](https://github.com/aymoun95/bpmn) and a live demo is hosted at [https://frontend-bpmn.onrender.com](https://frontend-bpmn.onrender.com).

> **Note:** The demo is on a free Render server and may take a minute to wake up if idle.

---

## Project Overview

The project is split into two main parts:

- **Frontend:** React + Vite + Tailwind CSS, using [bpmn-js](https://bpmn.io/toolkit/bpmn-js/) for diagram rendering
- **Backend:** Node.js + Express + Socket.IO for real-time communication and state management

Both are containerized for easy local development with Docker Compose.

### Folder Structure

```text
backend/    # Node.js/Express/Socket.IO backend
frontend/   # React + Vite + Tailwind frontend
```

---

## Step 1: Setting Up the Backend (Node.js + Socket.IO)

The backend manages:

- The current BPMN diagram XML
- User presence and count
- Locking state (who can edit)
- Real-time events via Socket.IO

**Key file:** `backend/src/controllers/socket.controller.ts`

```typescript
io.on("connection", (socket: Socket) => {
  // Send initial diagram
  const diagram = getDiagram();
  if (diagram) socket.emit("diagram:init", diagram);

  // Track users
  const users = userJoin();
  io.emit("user:count", users);

  // Locking logic
  socket.on("editor:lock", () => {
    if (lockEditor(socket.id)) {
      io.emit("editor:locked", { userId: socket.id });
    }
  });
  socket.on("editor:unlock", () => {
    if (unlockEditor(socket.id)) io.emit("editor:unlocked");
  });

  // Diagram updates
  socket.on("diagram:update", (xml) => {
    setDiagram(xml);
    socket.broadcast.emit("diagram:update", xml);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    userLeave();
    io.emit("user:count", getActiveUsers());
    if (unlockEditor(socket.id)) io.emit("editor:unlocked");
  });
});
```

- `io.emit` sends to all clients (including the sender)
- `socket.broadcast.emit` sends to all except the sender
- Locking ensures only one user can edit at a time

---

## Step 2: Building the Frontend (React + bpmn-js)

The frontend is responsible for:

- Rendering the BPMN diagram
- Handling user interactions
- Communicating with the backend via Socket.IO
- Displaying lock status and user count

### Modular React Hooks

To keep the code clean, I split the logic into custom hooks:

- `useModelerEvents` — sets up the BPMN modeler and event bus
- `useBpmnSocket` — manages all socket events
- `useBpmnLock` — handles lock state and disables editing when locked

**Example: useBpmnModeler hook**

```typescript
export function useBpmnModeler(id: string) {
  const [userCount, setUserCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedBy, setLockedBy] = useState<string | null>(null);
  const { modelerRef, eventBusRef } = useModelerEvents(id);

  // ...handlers for socket events...

  const socket = useBpmnSocket({
    onDiagramInit: handleDiagramInit,
    onDiagramUpdate: handleDiagramUpdate,
    onUserCount: handleUserCount,
    onLocked: handleLocked,
    onUnlocked: handleUnlocked,
  });

  useModelerEventsForLocking({
    modeler: modelerRef.current,
    eventBus: eventBusRef.current,
    isLocked,
    socket,
  });

  useBpmnLock({
    modeler: modelerRef.current,
    isLocked,
    lockedBy,
    socketId: socket.id ?? "",
  });

  return {
    userCount,
    lockedBy,
    isLocked,
    socketId: socket.id ?? "",
    modeler: modelerRef.current,
  };
}
```

### UI Components

- `BPMNContainer` — wraps the editor UI
- `Modeler` — renders the BPMN diagram and handles user actions
- `UserCount`, `LockOverlay` — show real-time status

---

## Step 3: Running Locally with Docker Compose

1. **Clone the repo:**
   ```bash
   git clone https://github.com/aymoun95/bpmn.git
   cd bpmn
   ```
2. **Start everything:**
   ```bash
   docker-compose up --build
   ```
3. **Open the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:3000](http://localhost:3000)

---

## Step 4: Try the Production Demo

![BPMN Example](/images/blogs/realtime-bpmn/bpmn.png)

You can try the live collaborative editor here:

👉 [https://frontend-bpmn.onrender.com](https://frontend-bpmn.onrender.com)

> **Note:** The server is on Render's free tier and may take a minute to wake up if idle.

---

## Conclusion

With React, Node.js, Socket.IO, and bpmn-js, you can build a modern, real-time collaborative BPMN editor with live locking. The modular approach makes it easy to extend and maintain. Try it out, fork the repo, and start building your own collaborative workflow tools!

---

**Source code:** [https://github.com/aymoun95/bpmn](https://github.com/aymoun95/bpmn)
