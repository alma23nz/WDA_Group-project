const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");

const storesDB = require("./dbstores");

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("welcom to the rest API");
});

// Get all stores
app.get("/stores", async (req, res) => {
  try {
    const stores = await storesDB.selectRecords();
    res.json(stores);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

// POST -----------------------------------------------
app.post("/api/stores", async (req, res) => {
  const newStore = req.body;

  try {
    const createdStore = await storesDB.createStore(
      newStore.name,
      newStore.url,
      newStore.district,
    );

    res.json({
      message: "POST - created a new store",
      data: createdStore,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create store" });
  }
});

// PUT -----------------------------------------------
app.put("/api/stores/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  try {
    const updatedStore = await storesDB.updateStore(
      id,
      updatedData.name,
      updatedData.url,
      updatedData.district,
    );

    res.json({
      message: `PUT - updated store with ID ${id}`,
      data: updatedStore,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update store" });
  }
});

// DELETE -----------------------------------------------
app.delete("/api/stores/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await storesDB.deleteStore(id);

    res.json({
      message: `DELETE - removed store with ID ${id}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete store" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// // Get store by ID
// app.get("/api/stores/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   try {
//     const store = await storesDB.getStoreByID(id);
//     if (!store) return res.status(404).json({ message: "Store not found" });
//     res.json(store);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/stores", (req, res) => {

//   const { name, url , district} = req.body;

//   if (!name || !url || !district ) {
//     return res.status(400).json({
//       message: "Name and price are required!"
//     });
//   }

//   const newStore = {
//     id: stores.length + 1,
//     name,
//     url,
//     district
//   };

//   stores.push(newStore);

//   res.json({
//     message: 'POST - created a new item',
//     data: newStore
//   });

// });
// app.put("/api/stores/:id", (req, res) => {

//   const storesID = parseInt(req.params.id);
//   const updatedData = req.body;

//   const store = stores.find(s => s.id === storesID);

//   if (!store) {
//     return res.status(404).json({
//       message: "store not found"
//     });
//   }

//   if (updatedData.name !== undefined) {
//     store.name = updatedData.name;
//   }

//   if (updatedData.url !== undefined) {
//     store.url = updatedData.url;
//   }
//   if (updatedData.district !== undefined) {
//     store.district = updatedData.district;
//   }

//   res.json({
//     message: `PUT - Updated item with ID ${storesID}`,
//     data: store
//   });

// });

// app.delete("/api/stores/:id", (req, res) => {
//     const storesID = parseInt(req.params.id);

//     const index = stores.findIndex(s => s.id === storesID);

//     if (index === -1) {
//     return res.status(404).json({ error: "store not found." });
//     }

//     const deletedStore = store.splice(index, 1)[0];

//     res.json({
//         message: "store deleted successfully!",
//         product: deletedStore
//     });
// });
