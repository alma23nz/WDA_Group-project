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
      storeDiv.classList.add("store"); // optional: for styling

      // Create a UL for the store properties
      const ul = document.createElement("ul");

      // Name
      const nameLi = document.createElement("li");
      nameLi.textContent = `Name: ${store.name}`;
      ul.appendChild(nameLi);

      // District
      const districtLi = document.createElement("li");
      districtLi.textContent = `District: ${store.district}`;
      ul.appendChild(districtLi);

      // URL as a clickable link using your logic
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
      link.href = url; // link target
      link.textContent = store.url; // link text
      link.target = "_blank"; // open in new tab
      urlLi.textContent = "URL: ";
      urlLi.appendChild(link);
      ul.appendChild(urlLi);

      // ---------------- DELETE BUTTON ----------------
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteStore(store.id);

      // ---------------- UPDATE BUTTON ----------------
      const updateBtn = document.createElement("button");
      updateBtn.textContent = "Update";
      updateBtn.onclick = () =>
        fillUpdateForm(store.id, store.name, store.url, store.district);

      storeDiv.appendChild(deleteBtn);
      storeDiv.appendChild(updateBtn);

      // Append UL to div
      storeDiv.appendChild(ul);

      // Append div to container
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
function fillUpdateForm(id, name, url, district) {
  document.getElementById("updateId").value = id;
  document.getElementById("updateName").value = name;
  document.getElementById("updateUrl").value = url;
  document.getElementById("updateDistrict").value = district;
}

// --------- UPDATE STORE ---------
async function updateStore() {
  const id = document.getElementById("updateId").value;

  const updatedStore = {
    name: document.getElementById("updateName").value,
    url: document.getElementById("updateUrl").value,
    district: document.getElementById("updateDistrict").value,
  };

  await fetch(`http://localhost:3000/api/stores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedStore),
  });

  fetchStores();

  document.getElementById("updateId").value = "";
  document.getElementById("updateName").value = "";
  document.getElementById("updateUrl").value = "";
  document.getElementById("updateDistrict").value = "";
}
