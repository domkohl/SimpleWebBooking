//Script pro stránku Profil uživatele


document.getElementById("jmenouzivatele").disabled = true;
document.getElementById("adresa").disabled = true;
document.getElementById("vek").disabled = true;
const token = sessionStorage.getItem("token")

//Vytvoření tabulky pro uživatelovi rezervace
function renderTable(listReservations) {
    // Hlavička 
    const col = ["Stav", "Check-In", "Check-out", "Pokoj", "resID"];
    // Tabulka
    const table = document.createElement("table");
    table.classList.add("tableUser")
    // Radek
    const tr = table.insertRow(-1);
    // Hlavička 
    for (let i = 0; i < col.length; i++) {
        let th = document.createElement("th");
        th.classList.add("tableUserCell")
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    const colFull = ["status", "checkIn", "checkOut", "room", "_id"];
    // Pridani dat
    for (let i = 0; i < listReservations.length; i++) {
        tr = table.insertRow(-1);
        tr.classList.add("tableUserRow")
        tr.setAttribute("onclick", `window.location.href = '/reservation/${listReservations[i]._id}';`)
        for (let j = 0; j < col.length; j++) {
            const tabCell = tr.insertCell(-1);
            tabCell.classList.add("tableUserCell")
            tabCell.innerHTML = listReservations[i][colFull[j]];;
        }
    }
    const divShowData = document.getElementById('showRes');
    divShowData.innerHTML = "";
    divShowData.appendChild(table);
}

//Zjištění, zda je přihlášen uživatel, když ano vypíší se informace
if (token === null || token === undefined) {
    alert("Prosím přihlaste se")
    window.location.replace("/login")
} else {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token)
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch("/users/me", requestOptions)
        .then(response => response.json())
        .then(result => {
            document.getElementById("jmenouzivatele").value = result.user.username
            document.getElementById("adresa").value = result.user.adress
            document.getElementById("vek").value = result.user.age
            result.reservation.forEach(element => element.checkIn = element.checkIn.split("T")[0])
            result.reservation.forEach(element => element.checkOut = element.checkOut.split("T")[0])
            renderTable(result.reservation)
        })
        .catch(error => console.log('error', error));
}

//Funkce pro změnu hesla
async function changePassword(event) {
    event.preventDefault()
    const password = document.getElementById("zmenahesla").value
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
        "token": sessionStorage.getItem("token"),
        "params": { "password": password }
    });
    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    const result = await fetch("/users/me", requestOptions)
    const finnalResult = await result.json()
    if (finnalResult.status === "ok") {
        alert("Úspěšná změna hesla")
    } else {
        alert(finnalResult.error)
    }
}
document.getElementById("change-password").addEventListener("submit", changePassword)

//Funkce pro změnu údajů
async function changeProfil(event) {
    event.preventDefault()
    const username = document.getElementById("jmenouzivatele").value
    const adress = document.getElementById("adresa").value
    const age = document.getElementById("vek").value
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "token": sessionStorage.getItem("token"),
        "params": { "age": age, "adress": adress, "username": username }
    });

    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    const result = await fetch("/users/me", requestOptions)
    const finnalResult = await result.json()
    console.log(finnalResult)
    if (finnalResult.status === "ok") {
        alert("Úspěšná změna údajů")
    } else {
        alert(finnalResult.error)
    }
    location.reload();

}
document.getElementById("profile").addEventListener("submit", changeProfil)

//Tlačítko pro editaci inputu
function allowChanges() {
    document.getElementById("jmenouzivatele").disabled = false;
    document.getElementById("adresa").disabled = false;
    document.getElementById("vek").disabled = false;
}
document.getElementById("povolzmeny").addEventListener("click", allowChanges)

// Funkce odhlásí učivatele a smaže jeho token
async function logoutOne() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({ "token": sessionStorage.getItem("token") });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    const result = await fetch("/users/logout", requestOptions)
    const finnalResult = await result.json()
    if (finnalResult.status === "ok") {
        alert("Úspěšné odhlášení")
        sessionStorage.removeItem("token")
        location.reload();
    } else {
        alert(finnalResult.error)
    }
}
document.getElementById("logoutOne").addEventListener("click", logoutOne)

// Funkce odhlásí učivatele ze všech zařízení a smaže jeho tokeny
async function logoutAll() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ "token": sessionStorage.getItem("token") });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const result = await fetch("/users/logoutAll", requestOptions)
    const finnalResult = await result.json()
    if (finnalResult.status === "ok") {
        alert("Úspěšné odhlášení ze všech zařízení")
        sessionStorage.removeItem("token")
        location.reload();
    } else {
        alert(finnalResult.error)
    }
}
document.getElementById("logoutAll").addEventListener("click", logoutAll)