---
title: "Part 1: Apache Kafka Internals"
publishedAt: "2025-12-06"
summary: "A comprehensive, guide to Apache Kafka. Part 1 covers the core architecture: brokers, partitions, consumer groups, and the evolution to KRaft."
tags: ["kafka", "microservices", "distributed-systems"]
image: "https://i.ibb.co/TxhFqgc2/kafka.webp"
---

Apache Kafka is more than just a simple message queue; it's a powerful **distributed streaming platform**. At its core, it enables applications to publish, subscribe to, store, and process streams of records in a fault-tolerant and highly scalable manner. To truly leverage Kafka, you need to understand the fundamental components that make up its distributed architecture.

---

## 🏗️ The Core Architecture: Clusters and Brokers

![APache Kafka Bigger Picture](/images/blogs/kafka/kafka.png)

### 🗄️ Brokers (The Servers)

A **Kafka Broker** is simply a Kafka server. It's the core component responsible for storing the messages (events) and handling client requests (producing and consuming).

- A single broker can handle thousands of partitions and millions of messages per second.
- Each broker has a unique ID.
- Brokers work together to form a **Kafka Cluster**.

### 🔗 Cluster (The Distributed System)

A **Kafka Cluster** is a collection of one or more Kafka brokers working in concert.

- The cluster provides **fault tolerance** and **high availability**: if one broker fails, the data and services it provides are taken over by other active brokers.
- For older versions of Kafka, an external service like **ZooKeeper** (or more recently, its own built-in **KRaft**) is used for cluster management, coordinating brokers, and performing leader elections.

---

## 🗃️ Topics and Partitions: The Data Structure

### 📚 Topics

A **Topic** is a logical name for a stream of records. Think of it like a folder or a category where messages of a certain type are stored.

- Producers publish messages to topics.
- Consumers subscribe to topics to read the messages.
- Topics in Kafka are always **multi-producer** and **multi-subscriber**.

### 쪼 Partitions

For scalability and parallelism, a topic is divided into one or more **Partitions**.

- A partition is an ordered, immutable sequence of records (messages). Each record within a partition is assigned a sequential ID number called an **offset**.
- **Order is guaranteed only within a partition.** Kafka only guarantees that if message A is sent before message B, they will appear in the same order in the log of one partition. There is no ordering guarantee _across_ different partitions.
- Partitions are distributed across the brokers in the cluster. This distribution is key to Kafka's scalability—it allows a topic to handle far more data than a single server could manage.
- One broker acts as the **Leader** for a given partition, handling all read and write requests for that partition. Other brokers hold **Follower** replicas for redundancy. The number of copies of a partition determines the topic's replication factor, which is crucial for fault tolerance.

---

## 📤 Producers and Consumers: Sending and Receiving Data

### ➡️ Producers (The Publishers)

**Producers** are client applications that publish (write) data records to a topic.

- A producer must decide which partition a message should be written to.
  - If a **key** is provided with the message, all messages with the same key will be guaranteed to go to the **same partition**. This is vital for maintaining order for related events (e.g., all events for a specific user ID).
  - If no key is provided, the producer typically distributes messages using a **round-robin** strategy to ensure even load across all partitions.

### ⬅️ Consumers (The Subscribers)

**Consumers** are client applications that read (consume) data records from a topic.

- A consumer keeps track of the **offset** (position) in each partition it is reading from. This allows a consumer to stop and restart without losing its place.
- Consumers are "pull-based," meaning they actively request batches of messages from the broker when they are ready, instead of the broker pushing data to them. This prevents consumers from being overwhelmed.

---

## 👥 Consumer Groups: Scaling Consumption

A **Consumer Group** is a set of consumers that work together to consume a topic. This is the mechanism Kafka uses for **load balancing** and achieving high throughput in consumption.

- Every partition in a topic is consumed by **exactly one consumer** within a single consumer group at any given time.
- If a topic has n partitions, a consumer group can have at most n active consumers and other consumers become idle.
- If you have fewer consumers than partitions, some consumers will read from multiple partitions.
- **Different consumer groups** can independently consume the _same_ topic, each at their own pace and starting from their own offset. This is what allows one stream of data (topic) to feed multiple different applications or microservices. |

When a consumer joins or leaves a group, or when a broker fails, a **rebalance** occurs, automatically reassigning partitions among the remaining consumers in the group.

## 🏛️ Cluster Coordination: ZooKeeper vs. KRaft

For a Kafka cluster to function, the brokers need a mechanism to coordinate, manage metadata (like which topics exist, how many partitions they have, and who the leader is for each partition), and elect leaders.

### 🐘 ZooKeeper (Legacy)

In traditional (older) Kafka deployments, this coordination was handled by an external, separate service called **Apache ZooKeeper**.

- **Role:** ZooKeeper was the source of truth for all Kafka metadata.
- **Drawback:** It introduced operational complexity, requiring you to manage and scale a separate set of servers alongside your Kafka brokers.

### ⚡ KRaft (Kafka Raft)

Starting with version 2.8 and fully production-ready in 3.0+, Kafka introduced the **KRaft (Kafka Raft)** protocol, integrating the metadata management directly into Kafka itself.

- **Role:** It eliminates the ZooKeeper dependency, simplifying deployment and reducing operational overhead.
- **Mechanism:** KRaft uses the Raft consensus algorithm. Among the designated controller nodes, an **election system** runs to select a single **Active Controller**. This controller node is then responsible for being the authoritative source of cluster metadata (like knowing the state of all partitions and brokers) and propagating those changes to the rest of the cluster.
- **Advantage:** This streamlined, internal mechanism makes Kafka capable of supporting a much larger number of partitions and accelerates metadata operations.

**In essence, modern Kafka (using KRaft) is an independent, self-managing cluster, while older Kafka relied on ZooKeeper for governance.**
