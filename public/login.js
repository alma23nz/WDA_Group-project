document.getElementById("loginBtn").onclick = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include"   // important to store the cookie
  });

  const data = await res.json();

  if (res.ok) {
    // redirect to index.html (stores page) after successful login
    window.location.href = "/index.html";
  } else {
    alert(data.error); // invalid credentials
  }
};