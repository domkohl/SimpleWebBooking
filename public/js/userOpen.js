document.getElementById("jmenouzivatele").disabled = true;
document.getElementById("adresa").disabled = true;
document.getElementById("vek").disabled = true;
const token = sessionStorage.getItem("token")

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
              console.log(result)
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