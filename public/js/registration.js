//Funkce pro registrace uživatele na serverus
async function userRegistration(event) {
    event.preventDefault()
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const result = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            email,
            password
        })
    })
    const finnalResult = await result.json()
    if (finnalResult.status === "ok") {
        alert("Registrace úspěšná")
        window.location.replace("/login")
    } else {
        alert(finnalResult.error)
    }
}
document.getElementById("registration").addEventListener("submit", userRegistration)