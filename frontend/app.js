const BASE_URL = "/api";

let currentUser = "";

/* ---------------- REGISTER ---------------- */
function register() {
  if (!regUser.value || !regPass.value || !regBal.value) {
    alert("Please fill all registration fields");
    return;
  }

  fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    .then(msg => alert(msg))
    .catch(err => alert(err.message));
}

/* ---------------- LOGIN ---------------- */
function login() {
  if (!logUser.value || !logPass.value) {
    alert("Please enter username and password");
    return;
  }

  fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: logUser.value,
      password: logPass.value
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Invalid credentials");
      return res.text();
    })
    .then(msg => {
      alert(msg);
      currentUser = logUser.value;
    })
    .catch(err => alert(err.message));
}

/* ---------------- BALANCE ---------------- */
function getBalance() {
  if (!currentUser) {
    alert("Please login first");
    return;
  }

  fetch(`${BASE_URL}/account/balance/${currentUser}`)
    .then(res => {
      if (!res.ok) throw new Error("Unable to fetch balance");
      return res.text();
    })
    .then(bal => {
      balance.innerText = "Balance: " + bal;
    })
    .catch(err => alert(err.message));
}

