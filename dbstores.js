const fs = require("fs");
const stores = require("./stores.json");

const { Client } = require("pg");
// Configure the client to connect to your containerized PostgreSQL
const client = new Client({
  host: "localhost", // since the container's port is mapped to localho
  port: 5432,
  user: "postgres", // default user
  password: "12345", // password set in the container command
  database: "postgres", // default database
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database with async/await");
  } catch (err) {
    console.error("Connection error", err.stack);
  }
}
connectDB(); // should be called before any other function

function createTable() {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(500),
  url VARCHAR(1000),
  district VARCHAR(50)
  );
  `;
  client
    .query(createTableQuery) // try await would also work with async
    .then(() => console.log('Table "stores" created or already exists'))
    .catch((err) => console.error("Error creating table", err.stack));
}
// createTable();

async function insertStoresFromJSON() {
  try {
    for (const store of stores) {
      await client.query(
        "INSERT INTO stores (name, url, district) VALUES ($1, $2, $3)",
        [store.name, store.url, store.district]
      );
    }

    console.log("All JSON rows inserted successfully");
  } catch (error) {
    console.error("Error inserting rows:", error);
  }
}

insertStoresFromJSON();

async function deleteTable() {
  try {
    await client.query("DROP TABLE IF EXISTS stores");
    console.log("Table deleted successfully");
  } catch (error) {
    console.error("Error deleting table:", error);
  }
}

//deleteTable();
