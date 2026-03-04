const fs = require("fs");
const stores = require("./stores.json");

const { Client } = require("pg");

const client = new Client({
  host: "localhost", 
  port: 5432,
  user: "postgres", 
  password: "12345", 
  database: "postgres", 
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database with async/await");
  } catch (err) {
    console.error("Connection error", err.stack);
  }
}
connectDB(); 

async function createTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS stores (
      id SERIAL PRIMARY KEY,
      name VARCHAR(500),
      url VARCHAR(1000),
      district VARCHAR(50)
    );
  `;

  try {
    await client.query(createTableQuery);
    console.log('Table "stores" created or already exists');
  } catch (err) {
    console.error("Error creating table", err.stack);
  }
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
// insertStoresFromJSON()

async function selectRecords() {
const selectQuery = 'SELECT * FROM stores;';
try {
const res = await client.query(selectQuery);
return res.rows; 
console.log('All stores:', res.rows);
} catch (err) {
console.error('Error selecting records', err.stack);
}
}
selectRecords()

module.exports = { selectRecords };

async function getStoreByID(id) {
  const result = await client.query("SELECT * FROM stores WHERE id = $1", [id]);
  return result.rows[0] || null;
}
//getStoreByID()


async function deleteTable() {
  try {
    await client.query("DROP TABLE IF EXISTS stores");
    console.log("Table deleted successfully");
  } catch (error) {
    console.error("Error deleting table:", error);
  }
}

//deleteTable();

