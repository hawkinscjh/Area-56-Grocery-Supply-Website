// Get the objects we need to modify
let updateOrderForm = document.getElementById('update-order-line-form-ajax');
console.log("made it!")
// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
    console.log("made it!")
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let orderID =document.getElementById("updateOrderID")
    let inputProductID = document.getElementById("input-productID");
    let inputQuantity = document.getElementById("quantityInput");



    // Get the values from the form fields
    let orderIDValue = orderID.value;
    let productIDValue = inputProductID.value;
    let quantityValue = inputQuantity.value;
    console.log(productIDValue);

    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderIDValue,
        productID: productIDValue,
        quantity: quantityValue,

    };
    console.log(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update-order-line-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            let parsedData = JSON.parse(xhttp.response);
            let newRow = parsedData[parsedData.length - 1]
            // Add the new data to the table
            console.log(newRow);
            inputQuantity.value = newRow.quantity;
            window.location.reload(true);
      

  
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});
