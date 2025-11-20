<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Login Admin</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex justify-content-center align-items-center" style="height:100vh;">

<div class="card p-4 shadow" style="width:360px;">
  <h4 class="mb-3 text-center">Admin Login</h4>

  <input id="user" class="form-control mb-2" placeholder="Username">
  <input id="pass" type="password" class="form-control mb-3" placeholder="Password">

  <button class="btn btn-primary w-100" onclick="doLogin()">Login</button>
  <p id="err" class="text-danger mt-2 text-center"></p>
</div>

<script>
const API = "https://ancient-king-d447.hendraslaksono.workers.dev";

async function doLogin(){
  let username = user.value.trim();
  let password = pass.value.trim();

  let res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  let out = await res.json();

  if(out.status === "OK"){
    localStorage.setItem("logged", "yes");
    location.href = "../index.html";
  } else {
    err.textContent = "Login salah!";
  }
}
</script>
</body>
</html>