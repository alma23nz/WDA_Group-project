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

// --------------
// createTable
// --------------

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
//createTable();

// --------------
// insert the json 
// --------------

async function insertStoresFromJSON() {
  try {
    for (const store of stores) {
      await client.query(
        "INSERT INTO stores (name, url, district) VALUES ($1, $2, $3)",
        [store.name, store.url, store.district],
      );
    }

    console.log("All JSON rows inserted successfully");
  } catch (error) {
    console.error("Error inserting rows:", error);
  }
}
//insertStoresFromJSON();

// --------------
// Select from stores 
// --------------

async function selectRecords() {
  const selectQuery = "SELECT * FROM stores ORDER BY id";
  try {
    const res = await client.query(selectQuery);
    return res.rows;
    console.log("All stores:", res.rows);
  } catch (err) {
    console.error("Error selecting records", err.stack);
  }
}
selectRecords();

// --------------
// Create a new store
// --------------
async function createStore(name, url, district) {
  const query = `
    INSERT INTO stores (name, url, district)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  try {
    const res = await client.query(query, [name, url, district]);
    return res.rows[0];
  } catch (err) {
    console.error("Error creating store:", err);
    throw err;
  }
}

// --------------
// Update a store
// --------------

async function updateStore(id, name, url, district) {
  const query = `
    UPDATE stores
    SET name=$1, url=$2, district=$3
    WHERE id=$4
    RETURNING *;
  `;

  try {
    const res = await client.query(query, [name, url, district, id]);
    return res.rows[0];
  } catch (err) {
    console.error("Error updating store:", err);
    throw err;
  }
}

// --------------
// Delete a store
// --------------
async function deleteStore(id) {
  const query = `
    DELETE FROM stores
    WHERE id=$1;
  `;

  try {
    await client.query(query, [id]);
  } catch (err) {
    console.error("Error deleting store:", err);
    throw err;
  }
}

// --------------
// Export functions for the server
// --------------

module.exports = {
  selectRecords,
  createStore,
  updateStore,
  deleteStore,
};

async function getStoreByID(id) {
  const result = await client.query("SELECT * FROM stores WHERE id = $1", [id]);
  return result.rows[0] || null;
}
//getStoreByID()

// --------------
// Delete Table
// --------------

async function deleteTable() {
  try {
    await client.query("DROP TABLE IF EXISTS stores");
    console.log("Table deleted successfully");
  } catch (error) {
    console.error("Error deleting table:", error);
  }
}

//deleteTable();
