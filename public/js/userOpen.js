async function renderProfil(event){
    event.preventDefault()
    console.log("testsubmit")

    // const username = document.getElementById("username").value
    // const email = document.getElementById("email").value
    // const password = document.getElementById("password").value

    const token = sessionStorage.getItem("token")

    const result = await fetch("/users/me",{
        method: "GET",
        headers:{ "Content-Type": "application/json", "authorization": "Bearer "+token },
        // body: JSON.stringify({
        //     token:sessionStorage.getItem("token")
        // })
    })

        const finnalResult =  await result.text()
        
        // $( "html" ).html( finnalResult );
        console.log(finnalResult)
        // if(finnalResult.status === "ok"){
        //     //vse v proadku
        //     alert("Registrac uspesna")
        // }else{
        //     alert(finnalResult.error)
        // }

}
document.getElementById("openUser").addEventListener("click",renderProfil)