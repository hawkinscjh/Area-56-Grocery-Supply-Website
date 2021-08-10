// Get the objects we need to modify
let addOrderForm = document.getElementById('add-order_product-form-ajax');

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderID = document.getElementById("lineOrderID");
    let inputProductID = document.getElementById("input-product");
    let inputQuantityID = document.getElementById("quantityInput");


    // Get the values from the form fields
    let inputOrderIDValue = inputOrderID.value;
    let inputProductValue = inputProductID.value;
    let inputQuantityValue = inputQuantityID.value;


    // Put our data we want to send in a javascript object
    let data = {
        orderID: inputOrderIDValue,
        productID: inputProductValue,
        quantity: inputQuantityValue,

    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-line-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            updateTotal(xhttp.response);
            console.log("made it to add orderline!")
            // Clear the input fields for another transaction
            inputProductID.value = null;
            inputQuantityID.value = null;
            document.getElementById("error").innerText = null;
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
            document.getElementById("error").innerText= "ERROR: You cannot add a product already on the order and must fill out all fields.";
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

    console.log(newRow);
    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let productIDCell = document.createElement("TD");
    let quantityCell = document.createElement("TD");


    // Fill the cells with correct data
    idCell.innerText = newRow.orderID;
    productIDCell.innerText = newRow.repID;
    quantityCell.innerText = newRow.clientID;


    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(productIDCell);
    row.appendChild(quantityCell);

    
    // Add the row to the table
    currentTable.appendChild(row);

    window.location.reload(true);
};

updateTotal = (data) => {
    let parsedData = JSON.parse(data);
    total = 0;
    for (x=0;x<parsedData;x++){
        console.log(total);
        total = total + parsedData[x].cost;

    };
    document.getElementById("total_amount").innerText = "Total: " ;

};