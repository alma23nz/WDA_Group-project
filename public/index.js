console.log("Hello, world!");

async function fetchStores() {
  try {
    const response = await fetch("http://localhost:3000/stores");
    const stores = await response.json();
    console.log(stores);

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

      // ---------- DELETE BUTTON ----------
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteStore(store.id);

      // ---------- UPDATE BUTTON ----------
      const updateBtn = document.createElement("button");
      updateBtn.textContent = "Update";
      updateBtn.onclick = () => renderEditForm(store);
      // Button container
      const buttonDiv = document.createElement("div");
      buttonDiv.appendChild(deleteBtn);
      buttonDiv.appendChild(updateBtn);

      // Append elements in correct order
      storeDiv.appendChild(ul);
      storeDiv.appendChild(buttonDiv);

      // Append store to container
      container.appendChild(storeDiv);
    });
  } catch (err) {
    console.error("Error fetching stores:", err);
  }
}

fetchStores();

// ------- CREATE STORE ---------
async function createStore() {
  const nameField = document.getElementById("name");
  const urlField = document.getElementById("url");
  const districtField = document.getElementById("district");

  const newStore = {
    name: nameField.value,
    url: urlField.value,
    district: districtField.value,
  };

  await fetch("http://localhost:3000/api/stores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newStore),
  });

  fetchStores();

  nameField.value = "";
  urlField.value = "";
  districtField.value = "";
}

// -------- DELETE STORE ---------
async function deleteStore(id) {
  try {
    await fetch(`http://localhost:3000/api/stores/${id}`, {
      method: "DELETE",
    });

    console.log("Store deleted");
    fetchStores();
  } catch (error) {
    console.error("Delete failed:", error);
  }
}

// --------- FILL UPDATE FORM ---------
function renderEditForm(store) {
  const storeDiv = document.querySelector(`[data-id="${store.id}"]`);

  storeDiv.innerHTML = `
    <input id="editName" value="${store.name}" placeholder="Name">
    <input id="editUrl" value="${store.url}" placeholder="URL">
    <input id="editDistrict" value="${store.district}" placeholder="District">

    <button onclick="saveEdit(${store.id})">Save</button>
    <button onclick="fetchStores()">Cancel</button>
  `;
}

// --------- UPDATE STORE ---------
async function saveEdit(id) {
  const updatedStore = {
    name: document.getElementById("editName").value,
    url: document.getElementById("editUrl").value,
    district: document.getElementById("editDistrict").value,
  };

  await fetch(`http://localhost:3000/api/stores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedStore),
  });

  fetchStores();
}