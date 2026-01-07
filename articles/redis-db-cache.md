---
title: "Caching PostgreSQL Queries with Redis in Node.js"
publishedAt: "2025-11-05"
summary: "Learn how to speed up your Node.js applications by caching database queries using Redis, with step-by-step examples and code explanations."
tags: ["nodejs", "postgresql", "redis", "caching", "express"]
image: "https://i.ibb.co/NdhT695h/redis.png"
---

Caching is a key technique to improve your app’s performance by reducing repeated database queries. In this tutorial, we’ll show you how to:

- Set up PostgreSQL and Redis with Docker
- Seed the database
- Implement caching for queries in Node.js
- Invalidate cache when data changes

We’ll walk through the code step by step and show logs demonstrating cache hits and misses.

---

## 1. Setting Up PostgreSQL and Redis with Docker

We use `docker-compose` to spin up PostgreSQL and Redis easily:

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:17
    container_name: postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: redis_cache_db
    tmpfs:
      - /var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7.4
    container_name: redis
    restart: always
    command:
      [
        "redis-server",
        "--maxmemory",
        "200mb",
        "--maxmemory-policy",
        "allkeys-lru",
      ]
    ports:
      - "6379:6379"
```

**Explanation:**

- PostgreSQL runs in memory (`tmpfs`) for simplicity.
- Redis is configured with a 200MB max memory and an `allkeys-lru` policy, which evicts the least recently used keys when memory is full.

After running `docker-compose up`, both services will be available on their default ports.

---

## 2. Database Migration and Seeding

Next, we create a table and seed it with initial products. The `migrate.ts` script handles this:

```ts
import * as dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

async function migrate() {
  console.log("🚀 Running database migration...");

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC(10,2),
        image_url TEXT,
        sales_count INTEGER DEFAULT 0
      );
    `);

    const check = await pool.query(`SELECT COUNT(*) FROM products;`);
    if (parseInt(check.rows[0].count) === 0) {
      console.log("📦 Seeding initial data...");
      await pool.query(`
        INSERT INTO products (name, price, image_url, sales_count)
        VALUES
          ('MacBook Pro', 1999.99, 'mac.jpg', 200),
          ('iPhone 15', 1299.99, 'iphone.jpg', 150),
          ('iPad Air', 899.99, 'ipad.jpg', 120);
      `);
    } else {
      console.log("✅ Data already exists.");
    }

    console.log("✅ Migration completed.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrate();
```

**Explanation by chunks:**

- **Env Variables:** You can find a `.env.example` file in the repo (link below).
- **Database connection:** Uses `pg`’s `Pool` to manage connections.
- **Table creation:** Ensures `products` table exists.
- **Seeding data:** Inserts sample products only if the table is empty.

**Execution output example:**

```text
🚀 Running database migration...
📦 Seeding initial data...
✅ Migration completed.
```

---

## 3. Setting Up Express with Redis Caching

Here’s the main API file (`index.ts`) that demonstrates caching with Redis:

```ts
import dotenv from "dotenv";
import express from "express";
import { Redis } from "ioredis";
import { Pool } from "pg";

dotenv.config();

const app = express();
app.use(express.json());

// PostgreSQL setup
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

// Redis setup
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));
```

**Explanation:**

- **Express** handles API endpoints.
- **PostgreSQL** uses the same connection pool as in migration.
- **Redis** is connected via `ioredis`.

---

## 4. Caching Queries

We create a `/top-products` endpoint that caches the results:

```ts
app.get("/top-products", async (req, res) => {
  const cacheKey = "top-products";

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("⚡ Cache hit");
      return res.json(JSON.parse(cached));
    }

    console.log("🐢 Cache miss — querying Postgres...");
    const { rows } = await pool.query(`
      SELECT id, name, price, image_url, sales_count
      FROM products
      ORDER BY sales_count DESC
      LIMIT 20;
    `);

    await redis.set(cacheKey, JSON.stringify(rows), "EX", 300); // cache for 5 mins
    res.json(rows);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
```

**Chunk-by-chunk explanation:**

1. **Cache check:** `redis.get(cacheKey)`
2. **Cache hit:** Immediately return cached JSON
3. **Cache miss:** Query PostgreSQL and cache the result for 5 minutes (`EX = 300 seconds`)

**Terminal logs during execution:**

```text
🐢 Cache miss — querying Postgres...
⚡ Cache hit
```

---

## 5. Cache Invalidation

When a product’s sales count is updated, we need to invalidate the cache:

```ts
app.post("/update-sales/:id", async (req, res) => {
  const { id } = req.params;
  const { count } = req.body;

  try {
    await pool.query("UPDATE products SET sales_count = $1 WHERE id = $2", [
      count,
      id,
    ]);
    await redis.del("top-products"); // invalidate cache
    console.log("🧹 Cache invalidated");
    res.json({ message: "Product updated and cache cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Update failed");
  }
});
```

**Explanation:**

- **Update database:** Change `sales_count` for a product
- **Invalidate cache:** Delete the cached key in Redis to force fresh query next time

**Terminal logs during execution:**

```text
🧹 Cache invalidated
🐢 Cache miss — querying Postgres...
⚡ Cache hit
```

---

## 6. Testing the API

To easily test all these endpoints without manually writing cURL commands, you can use a **REST Client** extension in your IDE (like VS Code).

You can find an an example **`rest.http`** file for a similar setup on this repository: [Cache Queries with Redis](https://github.com/aymoun95/redis-cache-db-queries).

---

## 7. Note on Redis Eviction Policy:

In our `docker-compose.yml`, we configured Redis with a **Least Recently Used (LRU) eviction policy**:

```yaml
command:
  ["redis-server", "--maxmemory", "200mb", "--maxmemory-policy", "allkeys-lru"]
```

This means when Redis reaches its memory limit (200MB in our case), it will automatically remove the **least recently used keys** to make space for new ones. This ensures that frequently accessed data stays cached while old, unused data is evicted.

## 8. Monitoring Redis with RedisInsight:

To inspect and monitor your Redis data, you can use **[RedisInsight](https://redis.com/redis-enterprise/redis-insight/)** — a free GUI tool provided by Redis.
![RedisInsight Dashboard](/images/blogs/redis-db-cache/redis-insights.png "Redis insights Dashboard.")

## 9. Conclusion

Using Redis to cache database queries drastically improves performance:

- **Reduced database load**: Frequent queries are served from memory
- **Faster response times**: Redis queries are milliseconds, much faster than PostgreSQL
- **Cache invalidation**: Ensures data consistency after updates

This setup can be extended to other endpoints or larger applications with multiple cached keys and smarter invalidation strategies.
