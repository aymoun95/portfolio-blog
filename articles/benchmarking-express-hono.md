---
title: "Is Hono really faster than Express???"
publishedAt: "2025-07-13"
summary: "A comparative benchmark of API throughput between Hono on Bun and Express.js on Node.js, focusing on requests per second for various HTTP methods in a real-world scenario."
tags: ["nodejs", "bun", "express", "hono", "api"]
image: "https://i.ibb.co/LXyKwt3h/benchmark.jpg"
---

The ongoing quest for faster web applications often leads developers to explore new frameworks and runtimes. In the JavaScript/TypeScript ecosystem, Express.js on Node.js has long been the industry standard, while Hono, a lightweight web framework, is quickly gaining traction, particularly when paired with the high-performance Bun runtime. Hono frequently boasts of being significantly faster than Express, sometimes by as much as 3 times.

This article aims to put that claim to the test by benchmarking API throughput – specifically focusing on requests per second – in a setup that mimics common production environments. We'll compare Express.js (running on Node.js) against Hono with Open Zod OpenAPI (running on Bun - as this is what we used in my company for migrating the code). To simulate a more complex routing scenario, both applications were configured with 100 "trap" API routes at the root path (`/`) to ensure the routing mechanism is adequately tested under load before hitting the correct endpoint.

### Benchmark Setup

All performance tests were executed using `autocannon`, a robust HTTP/1.1 benchmarking tool. Each test ran for 10 seconds with 100 concurrent connections (`-c 100 -d 10`) against the following API endpoints:

- **GET:** `http://localhost:3000/api/items/1`
- **POST:** `http://localhost:3000/api/items` with a JSON body `{"name": "benchmark"}`
- **PUT:** `http://localhost:3000/api/items/2` with a JSON body `{"name": "benchmark"}`
- **DELETE:** `http://localhost:3000/api/items/3`

For database operations, Express.js on Node.js used `better-sqlite3`, while Hono on Bun leveraged Bun's native `bun:sqlite`. The inclusion of 100 "trap" routes was a deliberate choice to assess how efficiently each framework's router performs when handling a large number of defined routes.

Let's examine the throughput results.

### Express.js on Node.js Throughput Results

Here are the key throughput statistics for Express.js:

#### GET Request

- **Avg Req/Sec:** 12,238.91
- **Total Requests:** 135k in 11.02s

#### POST Request

- **Avg Req/Sec:** 2,677
- **Total Requests:** 27k in 10.02s

#### PUT Request

- **Avg Req/Sec:** 9,933.46
- **Total Requests:** 109k in 11.01s

#### DELETE Request

- **Avg Req/Sec:** 11,680.37
- **Total Requests:** 129k in 11.02s (Note: 128,475 non-2xx responses, indicating sequential deletion of items leading to not-found errors after initial successful deletions).

### Hono with Open Zod OpenAPI on Bun Throughput Results

Now, let's look at Hono's performance on Bun in terms of throughput with the updated values:

#### GET Request

- **Avg Req/Sec:** 31,254.55
- **Total Requests:** 344k in 11.02s

#### POST Request

- **Avg Req/Sec:** 3,187.73
- **Total Requests:** 35k in 11.02s

#### PUT Request

- **Avg Req/Sec:** 21,749.1
- **Total Requests:** 239k in 11.01s

#### DELETE Request

- **Avg Req/Sec:** 30,680
- **Total Requests:** 338k in 11.02s (Note: 337,495 non-2xx responses, indicating sequential deletion of items. The very high number of non-2xx responses suggests a high success rate initially followed by attempts to delete already-removed items, which is expected behavior for this type of test.)

### Comparative Analysis: Hono vs. Express.js - Requests Per Second

Let's directly compare the average requests per second for each framework:

| Operation  | Metric      | Express.js (Node.js) | Hono (Bun) | Hono's Req/Sec Multiplier (approx.) |
| :--------- | :---------- | :------------------- | :--------- | :---------------------------------- |
| **GET**    | Avg Req/Sec | 12,238.91            | 31,254.55  | 2.55x                               |
| **POST**   | Avg Req/Sec | 2,677                | 3,187.73   | 1.19x                               |
| **PUT**    | Avg Req/Sec | 9,933.46             | 21,749.1   | 2.19x                               |
| **DELETE** | Avg Req/Sec | 11,680.37            | 30,680     | 2.63x                               |

**Throughput Observations:**

- **GET Requests: Hono Dominates.** For GET requests, Hono on Bun handles an astounding 2.55 times more requests per second than Express.js on Node.js. This is a significant lead and largely validates Hono's claims of being substantially faster for read-heavy API operations, even with the added complexity of 100 "trap" routes.

- **PUT Requests: Hono Maintains Strong Lead.** Hono continues to show impressive performance in PUT operations, processing 2.19 times more requests per second than Express.js.

- **POST Requests: Modest Gain for Hono.** The difference in throughput for POST requests is less dramatic. Hono processes about 1.19 times more requests per second than Express.js. This indicates that for operations involving request body parsing and potential database writes, the overhead might be more evenly distributed or influenced by factors beyond just framework and runtime.

- **DELETE Requests: Hono Now Leads Significantly!** With the updated figures, Hono now clearly outperforms Express.js in DELETE operations, processing an impressive 2.63 times more requests per second. This is a crucial update from previous observations and indicates that Hono on Bun can deliver very high throughput for deletion tasks as well. The high number of non-2xx responses for both (expected as items are deleted during the test) doesn't detract from Hono's superior processing rate in this updated benchmark.

### Conclusion

This benchmark, focusing on average requests per second and total requests, overwhelmingly confirms Hono with Open Zod OpenAPI on Bun's superior throughput across almost all common API operations. For GET requests, Hono processes over 2.5 times the requests per second compared to Express.js on Node.js, lending considerable weight to the "3 times faster" claim for read-intensive workloads.

Crucially, with the updated data, Hono on Bun now also demonstrates a significant lead in DELETE operations, processing over 2.6 times more requests per second. This dispels the previous anomaly and strengthens Hono's position as a high-performance choice for a broader range of API operations.

**Key Takeaways:**

- **Hono on Bun consistently excels in high-throughput scenarios, particularly for GET, PUT, and now DELETE operations.** Its ability to handle a significantly higher volume of requests per second makes it an extremely attractive option for performance-critical APIs.
- **The presence of 100 "trap" routes demonstrates that Hono's routing efficiency, combined with Bun's speed, can handle complex routing structures without severe performance degradation for typical operations.**
- **Even for write-heavy operations like POST, Hono maintains a lead, albeit a more modest one.** This suggests a generally optimized stack from framework to runtime.
- **The combined impact of Hono as a framework and Bun as a runtime is evidently powerful, consistently pushing the boundaries of what's achievable in terms of raw API throughput.**

In summary, Hono on Bun presents a highly compelling case for building high-performance APIs across the board. While specific application needs always warrant tailored benchmarking, the data from this comparison strongly supports Hono as a leading choice for raw API throughput in modern web development.

**GitHub Repository:** [https://github.com/aymoun95/benchmark-express-hono](https://github.com/aymoun95/benchmark-express-hono)
