const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();

const uri =
  "mongodb+srv://admin:haslo1@cluster0.wtsvqmh.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.post("/checkauthorization/", async (req, res) => {
  await client.connect();

  const username = req.body.username;

  const collection = client.db("users").collection("users");

  const query = { username };

  const user = await collection.findOne(query);

  await client.close();

  return res.json(user);
});

app.get("/adduser/:username", async (req, res) => {
  await client.connect();

  const username = req.params.username;

  const collection = client.db("users").collection("users");

  const newUser = {
    username,
  };

  await collection.insertOne(newUser);

  await client.close();

  return res.json("User created");
});

app.get("/removeuser/:username", async (req, res) => {
  await client.connect();

  const username = req.params.username;

  const collection = client.db("users").collection("users");

  const query = { username };

  await collection.deleteOne(query);

  await client.close();

  return res.json("User deleted");
});

app.listen(process.env.PORT || 3000);
