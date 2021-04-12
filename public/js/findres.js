

async function userRegistration(event){
    event.preventDefault()
    console.log("testsubmit")

    const username = document.getElementById("ckeckIn").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    console.log(username)
    const result = await fetch("/api/register",{
        method: "POST",
        headers:{ "Content-Type": "application/json"},
        body: JSON.stringify({
            username,
            email,
            password
        })
    })

        const finnalResult =  await result.json()
        
        if(finnalResult.status === "ok"){
            //vse v proadku
            alert("Registrac uspesna")
        }else{
            alert(finnalResult.error)
        }

}




document.getElementById("findres").addEventListener("submit",userRegistration)