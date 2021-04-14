function renderTable(listReservations){

    // Extract value from table header. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    var col = ["Pokoj","Cena","Kapacita","PokojID"];

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

    var colFull = ["name","price","capacity","_id"];

        // add json data to the table as rows.
    for (var i = 0; i < listReservations.length; i++) {

        tr = table.insertRow(-1);
        tr.classList.add("tableUserRow")
        // tr.setAttribute("onclick",`window.location.href = '/reservation/${listReservations[i]._id}';`)  
        

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


async function findReservations(event){
    event.preventDefault()
    console.log("testsubmit")

    const checkIn = document.getElementById("ckeckIn").value
    const checkOut = document.getElementById("ckeckOut").value

    // console.log(checkIn)
    // console.log(checkOut)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("checkin", checkIn);
    myHeaders.append("checkout", checkOut);

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };
    const result = await fetch("/api/reservation-date", requestOptions)
    const finnalResult = await result.json()
        console.log(finnalResult)
        if(finnalResult.status === "ok"){
            //vse v proadku
            alert("Terminy vyhledany")
            renderTable(finnalResult.rooms)
        }else{
            alert(finnalResult.error)
        }



        





}




document.getElementById("findres").addEventListener("submit",findReservations)