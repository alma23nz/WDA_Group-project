console.log("Hello, world!");
fetch("stores.json")
  .then((response) => response.json())
  .then((stores) => {
    console.log(stores);

    const container = document.getElementById("container");

    stores.forEach((item) => {
      let url;

      if (item.url.startsWith("http")) {
        url = item.url;
      } else {
        url = "https://" + item.url;
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
