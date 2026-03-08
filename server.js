const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");

const storesDB = require("./dbstores");

app.use(express.json());
app.use("/",express.static("public"));

app.get("/", (req, res) => {
  res.send("welcom to the rest API");
});

// Get all stores
app.get("/api/stores", async (req, res) => {
  try {
    const { sort, order } = req.query;

    let stores = await storesDB.selectRecords();

    if (sort) {
      stores.sort((a, b) => {
        const valA = (a[sort] ?? "").toLowerCase();
        const valB = (b[sort] ?? "").toLowerCase();

        if (valA < valB) return order === "desc" ? 1 : -1;
        if (valA > valB) return order === "desc" ? -1 : 1;
        return 0;
      });
    }

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
