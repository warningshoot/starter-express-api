const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();

var jsonParser = bodyParser.json();

const uri =
  "mongodb+srv://admin:haslo1@cluster0.wtsvqmh.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.post("/checkauthorization/", jsonParser, async (req, res) => {
  await client.connect();

  const username = req.body.username;

  const collection = client.db("users").collection("users");

  const query = { username };

  const user = await collection.findOne(query);

  if (user == null) {
    return res.status(400).send("Bad");
  }

  return res.status(200).send("Ok");
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
