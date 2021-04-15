document.getElementById("jmenouzivatele").disabled = true;
document.getElementById("adresa").disabled = true;
document.getElementById("vek").disabled = true;
const token = sessionStorage.getItem("token")

function renderTable(listReservations){

        // Extract value from table header. 
        // ('Book ID', 'Book Name', 'Category' and 'Price')
        var col = ["Stav","Check-In","Check-out","Pokoj","resID"];

        // Create a table.
        var table = document.createElement("table");
        table.classList.add("tableUser")

        // Create table header row using the extracted headers above.
        var tr = table.insertRow(-1);                   // table row.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th"); 
            th.classList.add("tableUserCell")     // table header.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        var colFull = ["status","checkIn","checkOut","room","_id"];

            // add json data to the table as rows.
        for (var i = 0; i < listReservations.length; i++) {

            tr = table.insertRow(-1);
            tr.classList.add("tableUserRow")
            tr.setAttribute("onclick",`window.location.href = '/reservation/${listReservations[i]._id}';`)  
            

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.classList.add("tableUserCell")
                tabCell.innerHTML = listReservations[i][colFull[j]];;
            }
        }
        var divShowData = document.getElementById('showRes');
        divShowData.innerHTML = "";
        divShowData.appendChild(table);

}


if(token === null || token === undefined){
    alert("Prosim prihlaste se ")
}else{
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token)
        var requestOptions = {
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
            //   console.log(result.reservation)
              renderTable(result.reservation)
            //   tableClicling()
          })
          .catch(error => console.log('error', error));
    }


async function changePassword(event){
    event.preventDefault()
    const password = document.getElementById("zmenahesla").value
    // console.log(password)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"token":sessionStorage.getItem("token"),
    "params":{"password": password}});

    var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    const result = await fetch("/users/me", requestOptions)
    const finnalResult = await result.json()
    console.log(finnalResult)
    if(finnalResult.status === "ok"){
        //vse v proadku
        alert("Úspěšná změna hesla")
    }else{
        alert(finnalResult.error)
    }
}
document.getElementById("change-password").addEventListener("submit",changePassword)

async function changeProfil(event){
    event.preventDefault()
    const username = document.getElementById("jmenouzivatele").value
    const adress = document.getElementById("adresa").value
    const age = document.getElementById("vek").value
    // console.log(password)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"token":sessionStorage.getItem("token"),
    "params":{"age":age,"adress":adress,"username":username}});

    var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    const result = await fetch("/users/me", requestOptions)
    const finnalResult = await result.json()
    console.log(finnalResult)
    if(finnalResult.status === "ok"){
        //vse v proadku
        alert("Úspěšná změna údajů")
    }else{
        alert(finnalResult.error)
    }
    location.reload();

}
document.getElementById("profile").addEventListener("submit",changeProfil)

function allowChanges(){
    document.getElementById("jmenouzivatele").disabled = false;
    document.getElementById("adresa").disabled = false;
    document.getElementById("vek").disabled = false;
}

document.getElementById("povolzmeny").addEventListener("click",allowChanges)


async function logoutOne(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({"token":sessionStorage.getItem("token")});
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const result = await fetch("/users/logout", requestOptions)
    const finnalResult = await result.json()
    if(finnalResult.status === "ok"){
        //vse v proadku
        alert("Úspěšné odhlášení")
        sessionStorage.removeItem("token")
        location.reload();
    }else{
        alert(finnalResult.error)
    }
}

document.getElementById("logoutOne").addEventListener("click",logoutOne)

async function logoutAll(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({"token":sessionStorage.getItem("token")});
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const result = await fetch("/users/logoutAll", requestOptions)
    const finnalResult = await result.json()
    if(finnalResult.status === "ok"){
        //vse v proadku
        alert("Úspěšné odhlášení ze všech zařízení")
        sessionStorage.removeItem("token")
        location.reload();
    }else{
        alert(finnalResult.error)
    }
 }
 
 document.getElementById("logoutAll").addEventListener("click",logoutAll)