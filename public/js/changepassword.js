

async function userRegistration(event){
    event.preventDefault()
    console.log("testsubmit")

    const password = document.getElementById("password").value

    const result = await fetch("/api/changepassword",{
        method: "POST",
        headers:{ "Content-Type": "application/json"},
        body: JSON.stringify({
            newPassword: password,
            token:localStorage.getItem("token")
        })
    })

        const finnalResult =  await result.json()
        
        if(finnalResult.status === "ok"){
            //vse v proadku
            alert("Úspěšná registrace")
        }else{
            alert(finnalResult.error)
        }

}

document.getElementById("change-password").addEventListener("submit",userRegistration)