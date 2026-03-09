// --------------
// login
// --------------

document.getElementById("loginBtn").onclick = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include"  
  });

  const data = await res.json();

  if (res.ok) {
    window.location.href = "/index.html";
  } else {
    alert(data.error);
  }
};