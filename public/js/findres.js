//Script pro stránku vyhledání možné Rezervace
//Lze vyhledat volné pokoje dle zadaného termínu, vybrat je a vytvořit rezervaci

//Pomocná funkce při kliknutí na řádek tabulky přidá id pokoje do labelu, k vytvořeni rezervace
function setRoomId(poradi) {
    const id = document.getElementsByClassName("tableRez")[0].getElementsByTagName('tr')[poradi].getElementsByTagName('td')[3].textContent
    document.getElementById("idpokoje").textContent = id
}
//Vytvoření tabulky z odpovědi ze serveru, jaké termíny jsou volné
function renderTable(listReservations) {
    // Hlavička 
    const col = ["Pokoj", "Cena", "Kapacita", "PokojID"];
    // Tabulka
    const table = document.createElement("table");
    table.classList.add("tableUser")
    table.classList.add("tableRez")
    // Radek
    const tr = table.insertRow(-1);
    // Hlavička 
    for (let i = 0; i < col.length; i++) {
        const th = document.createElement("th");
        th.classList.add("tableUserCell")
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    const colFull = ["name", "price", "capacity", "_id"];
    // Pridani dat
    for (let i = 0; i < listReservations.length; i++) {
        tr = table.insertRow(-1);
        tr.classList.add("tableUserRow")
        tr.setAttribute("onclick", `setRoomId(${i + 1})`)
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

// Funkce pro zeptání se serveru na volné termíny - zavolání funkce na vykreselní tabulky
async function findReservations(event) {
    event.preventDefault()
    const checkIn = document.getElementById("checkin").value
    const checkOut = document.getElementById("checkout").value

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("checkin", checkIn);
    myHeaders.append("checkout", checkOut);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    const result = await fetch("/api/reservation-date", requestOptions)
    const finnalResult = await result.json()
    console.log(finnalResult)
    if (finnalResult.status === "ok") {
        alert("Termíny vyhledaný")
        renderTable(finnalResult.rooms)
    } else {
        alert(finnalResult.error)
    }
}
document.getElementById("findres").addEventListener("submit", findReservations)

// Funkce pro uložení rezervace an server
async function saveRes() {
    const idpokoje = document.getElementById("idpokoje").textContent
    const checkIn = document.getElementById("checkin").value
    const checkOut = document.getElementById("checkout").value
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ "token": sessionStorage.getItem("token"), "checkIn": checkIn, "checkOut": checkOut, "status": "pending", "room": idpokoje });
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const result = await fetch("http://localhost:3000/api/reservation", requestOptions)
    const finnalResult = await result.json()

    if (finnalResult.status === "ok") {
        alert("Termín uložen")
        location.reload();
    } else {
        alert(finnalResult.error)
    }
}
document.getElementById("bookNewRes").addEventListener("click", saveRes)