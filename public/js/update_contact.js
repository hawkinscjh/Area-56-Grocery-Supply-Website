// Get the objects we need to modify
let addContactForm = document.getElementById('update-contact-form-ajax');
console.log("made it!")
// Modify the objects we need
addContactForm.addEventListener("submit", function (e) {
    console.log("made it!")
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("fNameInput");
    let inputLastName = document.getElementById("lNameInput");
    let inputEmail = document.getElementById("contactEmailInput");
    let inputPhone = document.getElementById("contactPhoneInput");

    // Get the values from the form fields
    let contactIDValue = contactID.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let emailValue = inputEmail.value;
    let phoneValue = inputPhone.value;

    // Put our data we want to send in a javascript object
    let data = {
        contactID: contactIDValue,
        fName: firstNameValue,
        lName: lastNameValue,
        email: emailValue,
        phone: phoneValue
    };
    console.log(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update-contact-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            let parsedData = JSON.parse(xhttp.response);
            let newRow = parsedData[parsedData.length - 1]
            // Add the new data to the table
            contactID.value = newRow.contactID;
            inputFirstName.value = newRow.fName;
            inputLastName.value = newRow.lName;
            inputEmail.value = newRow.email;
            inputPhone.value = newRow.phone;  
             document.getElementById("submitButton").value = "Submit again?";          

  
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});

