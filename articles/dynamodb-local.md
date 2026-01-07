---
title: "Run DynamoDB Locally with Docker 🐳"
publishedAt: "2025-11-04"
summary: "Learn how to set up DynamoDB locally using Docker and build a full CRUD API with Express.js and AWS SDK v3."
tags: ["nodejs", "aws", "dynamodb", "express", "docker"]
image: "https://i.ibb.co/dJjzB1mt/dynamodb.png"
---

Building applications that rely on **Amazon DynamoDB** is much smoother when you can develop and test locally. This guide will walk you through setting up a local DynamoDB instance using **Docker Compose** and pairing it with an **Express.js** application to perform basic CRUD (Create, Read, Update, Delete) operations.

---

## 🛠️ Prerequisites

Before you start, make sure you have the following installed:

- **Docker** and **Docker Compose**
- **Node.js** and **npm** (or yarn/pnpm)
- **AWS CLI** (Optional, but useful for testing the DynamoDB container)

---

## 📦 Step 1: Set up DynamoDB with Docker Compose

We'll start by defining our services in a `docker-compose.yml` file. This file will spin up the local DynamoDB container.

### `docker-compose.yml`

```yml
version: "3.8"
services:
  dynamodb-local:
    image: amazon/dynamodb-local
    ports:
      - "8000:8000"
    container_name: dynamodb-local
    command: -jar DynamoDBLocal.jar -sharedDb -inMemory
    restart: "no"
```

This file specifies a service named `dynamodb-local`. It uses the `amazon/dynamodb-local:latest` Docker image, maps port **8000** on the host machine to port 8000 inside the container.

### Run the Container

Execute the following command in your project's root directory:

```bash
docker-compose up -d
```

You now have a local DynamoDB instance running at `http://localhost:8000`.

---

## 🚀 Step 2: Set up the Express.js Application

Next, we'll create a simple Express application that connects to this local database.

### Project Setup

1.  Initialize a new Node.js project and install dependencies:
    ```bash
    npm init -y
    npm install express uuid @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
    ```
2.  Create the main files: `lib/dynamodb.js` (for DB client and table creation) and `index.js` (for Express server).

### `lib/dynamodb.js` (AWS SDK Client and Table Setup)

This file sets up the AWS SDK v3 client and the `createTable` function used by the Express app.

```javascript
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  CreateTableCommand,
} = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "Items";

// 1. Create the base DynamoDB client configuration
const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
  credentials: {
    // Dummy credentials explicit required for v3
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
});

// 2. Wrap the base client to get the Document Client (for simple JS objects)
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

// Function to create the table
async function createTable() {
  const params = {
    TableName: TABLE_NAME,
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }], // Partition key
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }], // S for String
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };

  try {
    // Send the command using the base client
    await client.send(new CreateTableCommand(params));
    console.log(`Table created: ${TABLE_NAME}`);
  } catch (error) {
    if (error.name === "ResourceInUseException") {
      console.log(`Table ${TABLE_NAME} already exists.`);
    } else {
      console.error(
        "Unable to create table. Error:",
        JSON.stringify(error, null, 2)
      );
    }
  }
}

module.exports = {
  docClient,
  TABLE_NAME,
  createTable,
};
```

### `index.js` (Express Server and CRUD Routes)

We'll break down the `index.js` file into its logical components:

#### 1\. Server Listen and Table Creation (Start Server)

This final block sets up Express, uses middleware, and starts the server, ensuring the DynamoDB table is created _after_ the Express app begins listening.

```javascript
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { docClient, TABLE_NAME, createTable } = require("./lib/dynamodb");
const {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const app = express();
const port = 3000;

app.use(express.json());
// ... all app.post, app.get, app.put, app.delete routes here ...

// Start server
app.listen(port, async () => {
  console.log(`Express app listening at http://localhost:${port}`);
  await createTable();
});
```

#### 2\. Create Item (POST /items)

This route handles the creation of a new item, assigning a unique ID and a timestamp, then using `PutCommand` to save it to DynamoDB.

```javascript
// --- 1. CREATE Operation (POST /items) ---
app.post("/items", async (req, res) => {
  const item = {
    id: uuidv4(),
    content: req.body.content || "Default Content",
    timestamp: new Date().toISOString(),
  };

  const params = { TableName: TABLE_NAME, Item: item };

  try {
    await docClient.send(new PutCommand(params));
    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).send("Error creating item.");
  }
});
```

#### 3\. Read All Items (GET /items)

This route performs a `ScanCommand` to retrieve all items in the table.

```javascript
// --- 2. READ ALL Operation (GET /items) ---
app.get("/items", async (req, res) => {
  const params = { TableName: TABLE_NAME };

  try {
    const data = await docClient.send(new ScanCommand(params));
    res.json(data.Items);
  } catch (error) {
    console.error("Error retrieving all items:", error);
    res.status(500).send("Error retrieving items.");
  }
});
```

#### 4\. Read Specific Item (GET /items/:id)

This route uses a `GetCommand` with the item's `id` as the Key to fetch a single record.

```javascript
// --- 3. READ Specific Item Operation (GET /items/:id) ---
app.get("/items/:id", async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id: req.params.id },
  };

  try {
    const data = await docClient.send(new GetCommand(params));

    if (data.Item) {
      res.json(data.Item);
    } else {
      res.status(404).send("Item not found.");
    }
  } catch (error) {
    console.error("Error retrieving specific item:", error);
    res.status(500).send("Error retrieving item.");
  }
});
```

#### 5\. Update and Delete Operations (PUT/DELETE /items/:id)

These two routes handle modifications to an existing item using `UpdateCommand` and removal using `DeleteCommand`.

```javascript
// --- 4. UPDATE Operation (PUT /items/:id) ---
app.put("/items/:id", async (req, res) => {
  const id = req.params.id;
  const { content } = req.body;

  const params = {
    TableName: TABLE_NAME,
    Key: { id: id },
    UpdateExpression: "set content = :c, updatedAt = :u",
    ExpressionAttributeValues: {
      ":c": content,
      ":u": new Date().toISOString(),
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const data = await docClient.send(new UpdateCommand(params));
    res.json(data.Attributes);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).send("Error updating item.");
  }
});

// --- 5. DELETE Operation (DELETE /items/:id) ---
app.delete("/items/:id", async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id: req.params.id },
  };

  try {
    await docClient.send(new DeleteCommand(params));
    res.status(204).send(); // 204 No Content is standard for successful deletion
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("Error deleting item.");
  }
});
```

---

## 🧪 Step 3: Test the CRUD API

You can test the API using tools like **cURL** or **Postman**.

| Operation      | Method   | Endpoint    | Body (JSON)                        | Description                   |
| :------------- | :------- | :---------- | :--------------------------------- | :---------------------------- |
| **Create**     | `POST`   | `/items`    | `{"content": "A crucial task..."}` | Adds a new item.              |
| **Read** (One) | `GET`    | `/items/id` | (None)                             | Retrieves the item by its ID. |
| **Read** (All) | `GET`    | `/items`    | (None)                             | Retrieves all items (Scan).   |
| **Update**     | `PUT`    | `/items/id` | `{"content": "Updated task"}`      | Updates the item's content.   |
| **Delete**     | `DELETE` | `/items/id` | (None)                             | Deletes the item.             |

### Example Client Request (Testing Locally)

To easily test all these endpoints without manually writing cURL commands, you can use a **REST Client** extension in your IDE (like VS Code).

You can find an an example **`rest.http`** file for a similar setup on this repository: [CRUD API with Node.js, Express.js and Dynamo DB](https://github.com/aymoun95/dynamodb-local).

## ⚡️ Want to Use ElectroDB?

If you're interested in a tutorial that shows how to refactor this Express and DynamoDB setup to use the **ElectroDB** the DynamoDB library, please reach out!

And that's it! You have a fully functional local development environment using Docker Compose for DynamoDB and Express.js for your API.
