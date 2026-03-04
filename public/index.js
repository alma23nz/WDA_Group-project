console.log("Hello, world!");

async function fetchStores() {
  try {
    const response = await fetch("http://localhost:3000/stores");
    const stores = await response.json();
    console.log(stores);

    const container = document.getElementById("container");

    stores.forEach(store => {
      // Create a div
      const storeDiv = document.createElement("div");

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

      // URL as a clickable link
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

