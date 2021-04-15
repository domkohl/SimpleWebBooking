//Funkce pro přihlášní uživatele a uložení tokenu
async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const result = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const finnalResult = await result.json();
  if (finnalResult.status === "ok") {
    sessionStorage.setItem("token", finnalResult.data);
    window.location.replace("/profil")
  } else {
    alert(finnalResult.error);
  }
}
document.getElementById("login").addEventListener("submit", loginUser);
