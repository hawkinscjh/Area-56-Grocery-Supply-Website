// Get the objects we need to modify
let addContactForm = document.getElementById('update-order-form-ajax');
console.log("made it!")
// Modify the objects we need
addContactForm.addEventListener("submit", function (e) {
    console.log("made it!")
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let orderID =document.getElementById("updateOrderID")
    let inputRepID = document.getElementById("input-repID");
    let inputClientID = document.getElementById("input-clientID");



    // Get the values from the form fields
    let orderIDValue = orderID.value;
    let repIDValue = inputRepID.value;
    let clientIDValue = inputClientID.value;
    console.log(repIDValue);

    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderIDValue,
        repID: repIDValue,
        clientID: clientIDValue,

    };
    console.log(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            let parsedData = JSON.parse(xhttp.response);
            let newRow = parsedData[parsedData.length - 1]
            // Add the new data to the table
            orderID.value = newRow.orderID;
            inputRepID.value = newRow.repID;
            inputClientID.value = newRow.clientID;

             document.getElementById("submitButton").value = "Submit again?";          

  
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});

