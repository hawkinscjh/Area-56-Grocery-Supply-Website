// Get the objects we need to modify
let addClientForm = document.getElementById('update-client-form-ajax');
console.log("made it!")
// Modify the objects we need
addClientForm.addEventListener("submit", function (e) {
    console.log("made it!")
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("clientNameInput");
    let inputAddress = document.getElementById("clientAddressInput");
    let inputEmail = document.getElementById("clientEmailInput");
    let inputPhone = document.getElementById("clientPhoneInput");
    let inputContactID = document.getElementById("contactIDInput");
    let inputRepID = document.getElementById("repIDInput");

   // Get the values from the form fields
   let clientIDValue = clientID.value;
   let nameValue = inputName.value;
   let addressValue = inputAddress.value;
   let emailValue = inputEmail.value;
   let phoneValue = inputPhone.value;
   let contactIDValue = inputContactID.value;
   let repIDValue = inputRepID.value;

   // Put our data we want to send in a javascript object
   let data = {
       clientID: clientIDValue,
       name: nameValue,
       address: addressValue,
       email: emailValue,
       phone: phoneValue,
       contactID: contactIDValue,
       repID: repIDValue
   };

    console.log(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update-client-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            let parsedData = JSON.parse(xhttp.response);
            let newRow = parsedData[parsedData.length - 1]
            // Add the new data to the table
            clientID.value = newRow.clientID;
            inputName.value = newRow.name;
            inputAddress.value = newRow.address;
            inputEmail.value = newRow.email;
            inputPhone.value = newRow.phone;  
            inputContactID.value = newRow.contactID;
            inputRepID.value = newRow.repID;
             document.getElementById("submitButton").value = "Submit again?";          

  
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});



