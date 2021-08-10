// Get the objects we need to modify
let addClientForm = document.getElementById('add-client-form-ajax');

// Modify the objects we need
addClientForm.addEventListener("submit", function (e) {
    
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
    let nameValue = inputName.value;
    let addressValue = inputAddress.value;
    let emailValue = inputEmail.value;
    let phoneValue = inputPhone.value;
    let contactIDValue = inputContactID.value;
    let repIDValue = inputRepID.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        address: addressValue,
        email: emailValue,
        phone: phoneValue,
        contactID: contactIDValue,
        repID: repIDValue
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-client-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputAddress.value = '';
            inputEmail.value = '';
            inputPhone.value = '';
            inputContactID.value = '';
            inputRepID.value = '';
  
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("dataTable");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]


    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let addressCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let contactIDCell = document.createElement("TD");
    let repIDCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.clientID;
    nameCell.innerText = newRow.name;
    addressCell.innerText = newRow.address;
    emailCell.innerText = newRow.email;
    phoneCell.innerText = newRow.phone;
    contactIDCell.innerText = newRow.contactID;
    repIDCell.innerText = newRow.repID;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(addressCell);
    row.appendChild(emailCell);
    row.appendChild(phoneCell);
    row.appendChild(contactIDCell);
    row.appendChild(repIDCell);
    
    // Add the row to the table
    currentTable.appendChild(row);

    window.location.reload(true);
};
