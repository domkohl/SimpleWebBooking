const token = sessionStorage.getItem("token")
document.getElementById("pokojid").disabled = true;

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
    const url = window.location.href
    const id = url.substring(url.lastIndexOf('/') + 1)
    fetch("/api/reservation/"+id, requestOptions)
      .then(response => response.json())
      .then(result => {

          const checkInText= result.checkIn.split("T");
          document.getElementById("datumprijezdu").setAttribute("value",checkInText[0])

          const checkOutText = result.checkOut.split("T");
          document.getElementById("datumodjezdu").setAttribute("value",checkOutText[0])



        //   document.getElementById("status").value = result.status

          const select = document.getElementById("status"); 
          const options = ['pending','approved',"denied"]; 

          for(var i = 0; i < options.length; i++) {
                var opt = options[i];
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                if(result.status === opt){
                    el.setAttribute("selected", "selected")
                }
                select.appendChild(el);
          }
        //   document.getElementById("nazevpokoje").value = result.nameRoom

          const selectR = document.getElementById("nazevpokoje"); 
          const optionsR = result.allRoomNames; 

          for(var i = 0; i < options.length; i++) {
                var opt = optionsR[i];
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                if(result.nameRoom === opt){
                    el.setAttribute("selected", "selected")
                }
                selectR.appendChild(el);
          }
          document.getElementById("pokojid").value = result.roomId
          console.log(result)
        //   tableClicling()
      })
      .catch(error => console.log('error', error));
}

async function changeReservation(event){
    event.preventDefault()

    const checkIn = document.getElementById("datumprijezdu").value
    const checkOut = document.getElementById("datumodjezdu").value
    const elStatus = document.getElementById("status")
    const status =elStatus.options[elStatus.selectedIndex].value
    const elName = document.getElementById("nazevpokoje")
    const name =elName.options[elName.selectedIndex].value
    // console.log(password)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"token":sessionStorage.getItem("token"),"checkIn":checkIn,
    "checkOut":checkOut,"status":status,"room":name});

    var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    const url = window.location.href
    const id = url.substring(url.lastIndexOf('/') + 1)
    const result = await fetch("/api/reservation/"+id, requestOptions)
    const finnalResult = await result.json()
    console.log(finnalResult)
    if(finnalResult.status === "ok"){
        //vse v proadku
        alert("Úspěšná změna rezervace")
    }else{
        alert(finnalResult.error)
    }
    location.reload()

}
document.getElementById("editRezervation").addEventListener("submit",changeReservation)

async function deleteReservation(event){
    event.preventDefault()

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({"token":sessionStorage.getItem("token")});

    const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
    const url = window.location.href
    const id = url.substring(url.lastIndexOf('/') + 1)
    try {
        const result = await fetch("/api/reservation/"+id, requestOptions)
        const finnalResult = await result.json()
        console.log(result)
    if(finnalResult.status === "ok"){
        //vse v proadku
        alert("Úspěšne smazani")
        window.location.replace("/profil");
    }else{
        alert(finnalResult.error)
    }
    window.location.replace("/profil");
    } catch (error) {
        console.log("Rezervace nenalezena")
    }
    // location.reload();
    

}
document.getElementById("removeReservation").addEventListener("click",deleteReservation)
