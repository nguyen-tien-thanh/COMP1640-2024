const { MongoClient, ServerApiVersion } = require("mongodb");

async function connectToMongoDB() {
  const uri = process.env.MONGODB_URI;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } finally {
    await client.close();
  }
}

module.exports = connectToMongoDB;
