const express = require("express");
const app = express();
const PORT = 3000;
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const storesDB = require("./dbstores");

// --------------
// middleware used before requests
// --------------

app.use(express.json());
app.use("/", express.static("public"));

app.get("/", (req, res) => {
  res.send("welcom to the rest API");
});

// --------------
// Admin
// --------------

const SECRET = "mySecretCookieToken";
app.use(cookieParser(SECRET));
const ADMIN_USERNAME = "Group6";
const ADMIN_PASSWORD = "12345";

const sessions = {};
function requireAuth(req, res, next) {
  const token = req.cookies.authToken;

  if (token && sessions[token]) {
    next();
  } else {
    res.status(403).json({ error: "Not authorized" });
  }
}
app.get("/check-auth", (req, res) => {
  const token = req.cookies.authToken;
  if (token && sessions[token]) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// --------------
// login
// --------------

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString("hex");

    sessions[token] = { username };

    res.cookie("authToken", token, {
      httpOnly: true,
    });

    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid login" });
  }
});

// --------------
// logout
// --------------
app.get("/logout", (req, res) => {
  const token = req.cookies.authToken;

  if (token) {
    delete sessions[token];
  }

  res.clearCookie("authToken");
  res.json({ message: "Logged out" });
});

// --------------
// Get all stores
// --------------
app.get("/api/stores", async (req, res) => {
  try {
    const { sort, order } = req.query;

    let stores = await storesDB.selectRecords();

    if (sort) {
      stores.sort((a, b) => {
        const valA = a[sort] ?? ""; 
        const valB = b[sort] ?? "";

        if (valA === valB) return 0;                 
        if (order === "desc") return valA < valB ? 1 : -1; 
        return valA > valB ? 1 : -1;               
      });
    }

    res.json(stores);
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ error: "Failed to fetch stores" });
  }
});

// --------------
// POST
// --------------

app.post("/api/stores", requireAuth, async (req, res) => {
  const newStore = req.body;

  try {
    const createdStore = await storesDB.createStore(
      newStore.name,
      newStore.url,
      newStore.district,
      newStore.category,
    );

    res.json({
      message: "POST - created a new store",
      data: createdStore,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create store" });
  }
});

// --------------
// PUT
// --------------

app.put("/api/stores/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  try {
    const updatedStore = await storesDB.updateStore(
      id,
      updatedData.name,
      updatedData.url,
      updatedData.district,
      updatedData.category,
    );

    res.json({
      message: `PUT - updated store with ID ${id}`,
      data: updatedStore,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update store" });
  }
});

// --------------
// DELETE
// --------------

app.delete("/api/stores/:id", requireAuth, async (req, res) => {
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
