console.log("Hello, world!");
let editingStoreId = null;
let isLoggedIn = false;


// Check if admin is logged in
async function checkAuth() {
  const res = await fetch("/check-auth", { credentials: "include" });
  const data = await res.json();

  isLoggedIn = data.loggedIn;

  updateAuthButton();
  updateUI();
}

function updateAuthButton() {
  const authBtn = document.getElementById("authBtn");
  authBtn.textContent = isLoggedIn ? "Logout" : "Login";
  authBtn.onclick = isLoggedIn
    ? logout
    : () => window.location.href = "/login.html";
}
async function logout() {
  await fetch("/logout", { credentials: "include" });
  isLoggedIn = false;
  updateAuthButton();
  updateUI();
}
async function fetchStores() {
  try {
    const response = await fetch("/api/stores")
    const stores = await response.json();
   
    renderStores(stores);
    return stores; 
  } catch (err) {
    console.error("Error fetching stores:", err);
  }
}
function updateUI() {
  const storeContainer = document.getElementById("container");
  const addForm = document.querySelector("form");

  // Show Add Store form only if logged in
  addForm.style.display = isLoggedIn ? "block" : "none";

  // Update/Delete buttons for each store
  const storeDivs = storeContainer.querySelectorAll("div[data-id]");
  storeDivs.forEach(div => {
    const buttons = div.querySelectorAll("button");
    buttons.forEach(btn => {
      // Only show Update/Delete buttons if logged in
      if (btn.textContent === "Update" || btn.textContent === "Delete") {
        btn.style.display = isLoggedIn ? "inline-block" : "none";
      }
    });
  });
}

function renderStores(stores) {
 
   
    const container = document.getElementById("container");
    container.innerHTML = "";

    stores.forEach((store) => {
      // Create a div for each store
      const storeDiv = document.createElement("div");
      storeDiv.dataset.id = store.id;

      // Create a UL
      const ul = document.createElement("ul");

      // Name
      const nameLi = document.createElement("li");
      nameLi.textContent = `Name: ${store.name}`;
      ul.appendChild(nameLi);

      // District
      const districtLi = document.createElement("li");
      districtLi.textContent = `District: ${store.district}`;
      ul.appendChild(districtLi);

      // URL
      let url = "#";

      if (store.url) {
        if (store.url.startsWith("http")) {
          url = store.url;
        } else {
          url = "https://" + store.url;
        }
      }

      const urlLi = document.createElement("li");
      const link = document.createElement("a");
      link.href = url;
      link.textContent = store.url;
      link.target = "_blank";

      urlLi.textContent = "URL: ";
      urlLi.appendChild(link);
      ul.appendChild(urlLi);
       // ---------- UPDATE BUTTON ----------
      const updateBtn = document.createElement("button");
      updateBtn.textContent = "Update";
      updateBtn.onclick = () => renderEditForm(store);

      // ---------- DELETE BUTTON ----------
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteStore(store.id);

     
      // Button container
      const buttonDiv = document.createElement("div");
      buttonDiv.appendChild(updateBtn);
      buttonDiv.appendChild(deleteBtn);
      

      // Append elements in correct order
      storeDiv.appendChild(ul);
      storeDiv.appendChild(buttonDiv);

      // Append store to container
      container.appendChild(storeDiv);
    });
      updateUI();
  } 

document.getElementById("sortBtn").addEventListener("click", async () => {

  const field = document.getElementById("sortField").value;
  const order = document.getElementById("sortOrder").value;

  const response = await fetch(
    `http://localhost:3000/api/stores?sort=${field}&order=${order}`
  );

  const stores = await response.json();

  renderStores(stores);
});

// ------- CREATE STORE ---------
async function createStore() {
  const nameField = document.getElementById("Addname");
  const urlField = document.getElementById("Addurl");
  const districtField = document.getElementById("Adddistrict");
  
  const name = nameField.value.trim();
  const url = urlField.value.trim();
  const district = districtField.value.trim();
  
  if (!name || !district || !url) {
    alert("Please fill in all fields before adding a store.");
    return;
  }

  const newStore = {
    name: name,
    url: url,
    district: district,
  };

  await fetch("/api/stores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newStore),
    credentials: "include" 
  });

  fetchStores();

  nameField.value = "";
  urlField.value = "";
  districtField.value = "";
}


// --------- update EDIT FORM ---------

function renderEditForm(store) {

  // Prevent multiple edit forms
  if (editingStoreId !== null) {
    alert("Finish editing the current store first.");
    return;
  }

  editingStoreId = store.id;

  const storeDiv = document.querySelector(`[data-id="${store.id}"]`);

  storeDiv.innerHTML = `
    <input class="editName" value="${store.name}" placeholder="Name">
    <input class="editDistrict" value="${store.district}" placeholder="District">
    <input class="editUrl" value="${store.url}" placeholder="URL">

    <button class="saveBtn">Save</button>
    <button class="cancelBtn">Cancel</button>
  `;

  storeDiv.querySelector(".saveBtn").onclick = () => saveEdit(store.id, storeDiv);
  storeDiv.querySelector(".cancelBtn").onclick = cancelEdit;
}

// --------- UPDATE STORE ---------

async function saveEdit(id, storeDiv) {

  const updatedStore = {
    name: storeDiv.querySelector(".editName").value,
    district: storeDiv.querySelector(".editDistrict").value,
    url: storeDiv.querySelector(".editUrl").value,
  };

  await fetch(`http://localhost:3000/api/stores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedStore),
    credentials: "include" 
  });

  editingStoreId = null;
  fetchStores();
}

function cancelEdit() {
  editingStoreId = null;
  fetchStores();
}


// -------- DELETE STORE ---------
async function deleteStore(id) {
  try {
    await fetch(`http://localhost:3000/api/stores/${id}`, {
      method: "DELETE",
      credentials:"include"
    });

    console.log("Store deleted");
    fetchStores();
  } catch (error) {
    console.error("Delete failed:", error);
  }
}

checkAuth();
fetchStores();
