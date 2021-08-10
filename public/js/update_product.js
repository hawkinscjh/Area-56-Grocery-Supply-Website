// Get the objects we need to modify
let addProductForm = document.getElementById('update-product-form-ajax');
console.log("made it!")
// Modify the objects we need
addProductForm.addEventListener("submit", function (e) {
    console.log("made it!")
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    //let InputProductID = document.getElementById("updateProductID");
    let inputItem = document.getElementById("itemInput");
    let inputCost = document.getElementById("itemCost");


    // Get the values from the form fields
    let productIDValue = productID.value;
    console.log(productID.value);
    let itemValue = inputItem.value;
    let costValue = inputCost.value;

    // Put our data we want to send in a javascript object
    let data = {
        productID: productIDValue,
        item: itemValue,
        cost: costValue,
    };
    console.log(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update-product-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            let parsedData = JSON.parse(xhttp.response);
            let newRow = parsedData[parsedData.length - 1]
            // Add the new data to the table
            console.log("hey");
            console.log(productID);
            productID.value = newRow.productID;
            inputItem.value = newRow.item;
            inputCost.value = newRow.cost;
             document.getElementById("submitButton").value = "Submit again?";          

  
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

});

