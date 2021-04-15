//Script pro stránku editace Rezervace
//Když uživatel není přihlášen je přesměrován na login stránku.
//Rezervace se vykreslí jen když má uživatel práva ji vidět a editovat

const token = sessionStorage.getItem("token")
document.getElementById("pokojid").disabled = true;
//Zjištění, zda je přihlášen uživatel, když ano vypíší se informace
if (token === null || token === undefined) {
    alert("Prosím přihlašte se")
    window.location.replace("/login")
} else {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token)
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    const url = window.location.href
    const id = url.substring(url.lastIndexOf('/') + 1)
    fetch("/api/reservation/" + id, requestOptions)
        .then(response => response.json())
        .then(result => {
            const checkInText = result.checkIn.split("T");
            document.getElementById("datumprijezdu").setAttribute("value", checkInText[0])

            const checkOutText = result.checkOut.split("T");
            document.getElementById("datumodjezdu").setAttribute("value", checkOutText[0])

            const select = document.getElementById("status");
            const options = ['pending', 'approved', "denied"];

            for (let i = 0; i < options.length; i++) {
                const opt = options[i];
                const el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                if (result.status === opt) {
                    el.setAttribute("selected", "selected")
                }
                select.appendChild(el);
            }

            const selectR = document.getElementById("nazevpokoje");
            const optionsR = result.allRoomNames;

            for (let i = 0; i < options.length; i++) {
                const opt = optionsR[i];
                const el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                if (result.nameRoom === opt) {
                    el.setAttribute("selected", "selected")
                }
                selectR.appendChild(el);
            }
            document.getElementById("pokojid").value = result.roomId
        })
        .catch(error => console.log('error', error));
}
//Funkce pro odeslání požadavků na změnu na server
async function changeReservation(event) {
    event.preventDefault()
    const checkIn = document.getElementById("datumprijezdu").value
    const checkOut = document.getElementById("datumodjezdu").value
    const elStatus = document.getElementById("status")
    const status = elStatus.options[elStatus.selectedIndex].value
    const elName = document.getElementById("nazevpokoje")
    const name = elName.options[elName.selectedIndex].value

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
        "token": sessionStorage.getItem("token"), "checkIn": checkIn,
        "checkOut": checkOut, "status": status, "room": name
    });
    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    const url = window.location.href
    const id = url.substring(url.lastIndexOf('/') + 1)
    const result = await fetch("/api/reservation/" + id, requestOptions)
    const finnalResult = await result.json()

    if (finnalResult.status === "ok") {
        alert("Úspěšná změna rezervace")
    } else {
        alert(finnalResult.error)
    }
    location.reload()
}
document.getElementById("editRezervation").addEventListener("submit", changeReservation)

//Funkce pro odeslání požadavku na vymazaní rezervace na server
async function deleteReservation(event) {
    event.preventDefault()
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({ "token": sessionStorage.getItem("token") });
    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    const url = window.location.href
    const id = url.substring(url.lastIndexOf('/') + 1)
    try {
        const result = await fetch("/api/reservation/" + id, requestOptions)
        const finnalResult = await result.json()
        console.log(result)
        if (finnalResult.status === "ok") {
            alert("Úspěšne smazáno")
            window.location.replace("/profil");
        } else {
            alert(finnalResult.error)
        }
        window.location.replace("/profil")
    } catch (error) {
        console.log("Rezervace nenalezena")
    }
    location.reload();
}
document.getElementById("removeReservation").addEventListener("click", deleteReservation)
