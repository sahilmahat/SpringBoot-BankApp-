const API = "/api";

/* ---------- LOGIN ---------- */
function login() {
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: logUser.value,
      password: logPass.value
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Invalid credentials");
    return res.text();
  })
  .then(() => {
    localStorage.setItem("user", logUser.value);
    window.location = "dashboard.html";
  })
  .catch(err => loginMsg.innerText = err.message);
}

/* ---------- REGISTER ---------- */
function register() {
  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: regUser.value,
      password: regPass.value,
      balance: regBal.value
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Registration failed");
    return res.text();
  })
  .then(msg => registerMsg.innerText = msg)
  .catch(err => registerMsg.innerText = err.message);
}

/* ---------- DASHBOARD ---------- */
function getBalance() {
  const user = localStorage.getItem("user");
  fetch(`${API}/account/balance/${user}`)
    .then(res => res.text())
    .then(bal => balance.innerText = "Balance: ₹" + bal)
    .catch(() => dashMsg.innerText = "Unable to fetch balance");
}

function logout() {
  localStorage.clear();
  window.location = "index.html";
}

/* Auto load dashboard */
if (location.pathname.includes("dashboard")) {
  const user = localStorage.getItem("user");
  if (!user) location = "index.html";
  welcome.innerText = "Welcome, " + user;
  getBalance();
}

