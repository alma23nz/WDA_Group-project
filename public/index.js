console.log("Hello, world!");

async function fetchStores() {
  try {
    const response = await fetch("http://localhost:3000/stores");
    const stores = await response.json();
    console.log(stores); // display in console

    const container = document.getElementById("container");

    stores.forEach(store => {
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
      link.href = url;       // link target
      link.textContent = store.url; // link text
      link.target = "_blank";      // open in new tab
      urlLi.textContent = "URL: ";
      urlLi.appendChild(link);
      ul.appendChild(urlLi);

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
