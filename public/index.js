console.log("Hello, world!");
function fetchStores() {
  fetch("/api/stores")
  .then((response) => response.json())
  .then((stores) => {
    console.log(stores);

    const container = document.getElementById("container");

    stores.forEach(item => {
  let url = "#";

 if (item.url) {
  if (item.url.startsWith("http")) {
    url = item.url;
  } else {
    url = "https://" + item.url;
  }
}
  const div = document.createElement("div");
  div.innerHTML = `
    <h3>${item.name}</h3>
    <a href="${url}" target="_blank">Visit Store</a>
    <p>${item.district}</p>
  `;
  container.appendChild(div);
});
  })
  .catch((error) => console.error(error));
}

function fetchStoresByID(id) {
  fetch(`/api/stores${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Store not found');
      }
      return response.json(); 
    })
    .then(data => {
      console.log(`Store with ID ${id}:`, data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

// assigment 1 paper 2 lab 3
function addStores(name, url, district) {

  fetch("/api/stores", {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "name": name,
      "url": url,
      "district": district

    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('POST response data:', data);
  })
  .catch(error => {
    console.error("Error:", error);
  });

}

// assigment 2 paper 2 lab3
function updateStore (id, name, url, district){ 
  const updatedData = {};

   if (name !== undefined) { updatedData.name = name; } 
   if (url !== undefined) { updatedData.url = url; } 
   if (district !== undefined) { updatedData.district = district; } 

  fetch(`/api/stores${id}`, { 
    method: "PUT",
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify(updatedData) }) 

  .then(res => res.json()) 
  .then(data => { 
    console.log("Updated:", data); 
    
  }) 
  .catch(err => console.error(err)); 
}


// Assigment 3 paper 2 lab 3

function deletedStore(id) {

  fetch("/api/stores" + id, {
    method: "DELETE"
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {

    if (data.message === "Product not found") {
      console.error("Error:", data.message);
    } else {
      console.log("Success:", data.message);
      console.log("Deleted Product:", data.data);
    }

  })
  .catch(function(error) {
    console.error("Request failed:", error);
  });

}

