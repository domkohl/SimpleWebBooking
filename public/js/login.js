
async function userRegistration(event){
    event.preventDefault()
    console.log("testsubmit")

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const result = await fetch("/api/login",{
        method: "POST",
        headers:{ "Content-Type": "application/json"},
        body: JSON.stringify({
            email,
            password
        })
    })

        const finnalResult =  await result.json()
        
        if(finnalResult.status === "ok"){
            //vse v proadku
            console.log("TOKEn",finnalResult.data)
            localStorage.setItem("token",finnalResult.data)
        }else{
            alert(finnalResult.error)
        }

}


document.getElementById("login").addEventListener("submit",userRegistration)