// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 3306;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./database/db-connector')

// Implementing handlebars

var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', exphbs({                     // Create an instance of the handlebars engine to process templates
    extname: ".hbs"
}));
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// adding json capability

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(__dirname + '/public'));

/*
    ROUTES
*/
app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        res.render('index')                     // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                         // will process this file, before sending the finished HTML to the client.

//-----------------------------
// CLIENTS PAGE ROUTE
//-----------------------------

app.get('/clients', (req, res) =>{
// Note the call to render() and not send(). Using render() ensures the templating engine
// Define our query

        let query1 = `SELECT clients.clientID, clients.name, clients.address, clients.email, clients.phone, contacts.contactID, CONCAT(contacts.fname, ' ', contacts.lname) AS contact, sales_representatives.repID, CONCAT(sales_representatives.fname,' ',sales_representatives.lname) AS rep FROM clients 
        LEFT JOIN contacts on clients.contactID = contacts.contactID 
        LEFT JOIN sales_representatives on clients.repID = sales_representatives.repID 
        ORDER BY clientID;`;
        let query2 = `SELECT * FROM contacts;`;
        let query3 = `SELECT * FROM sales_representatives;`;

        db.connection.query(query1, function(error, rows, fields){    // Execute the query
            if(!error){
            
            let clients = rows;
            
            db.connection.query(query2, function(error, rows, fields){
                if(!error){
                    let contacts = rows;

                    //run 3rd query for order's sales_representative
                    db.connection.query(query3, function(error, rows, fields){
                        if(!error){
                            let reps = rows;

                            res.render('clients',{data: clients, reps: reps, contacts: contacts});

                        }
                        else{
                            console.log(error);
                        }});
                    }
                else{
                        console.log(error);
                    }
                });
            }
            else{
                console.log(error);
            }
            });
        });

//-----------------------------
//DELETE CLIENT
//-----------------------------

app.delete('/clients/:clientID', (req, res) => {
    db.connection.query(`DELETE FROM clients WHERE clientID=?;`, [req.params.clientID], function (error, result) {
        if (!error) {
            res.send('Deleted successfully');
        }else{
            console.log(error);
        };
    });
});

//-----------------------------
//ADD CLIENT POST
//-----------------------------

app.post('/add-client-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
  
        // Create the query and run it on the database
        query1 = `INSERT INTO clients (name, address, email, phone, contactID, repID) VALUES ('${data.name}', '${data.address}', '${data.email}', '${data.phone}', '${data.contactID}', '${data.repID}')`;
        db.connection.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on contacts
                query2 = `SELECT * FROM clients;`;
                db.connection.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

//-----------------------------
//UPDATE CLIENTS POST
//-----------------------------

app.post('/update-client-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
  
        // Create the query and run it on the database
        query1 = `UPDATE clients SET name='${data.name}', address='${data.address}', email='${data.email}', phone='${data.phone}', contactID='${data.contactID}', repID='${data.repID}' WHERE clientID = ${data.clientID};`;
        db.connection.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on contacts
                query2 = `SELECT * FROM clients WHERE clientID = ${data.clientID};`;
                db.connection.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

//-----------------------------
//UPDATE CLIENTS PAGE
//-----------------------------

app.get('/clients/:clientID', (req, res) =>{

 // Define our query
 //let query1 = `SELECT * FROM clients WHERE clientID = ${req.params.clientID};`;
let query1 = `SELECT clients.clientID, clients.name, clients.address, clients.email, clients.phone, contacts.contactID AS contactID, CONCAT(contacts.fname, ' ', contacts.lname) AS contact, sales_representatives.repID AS repID, CONCAT(sales_representatives.fname,' ',sales_representatives.lname) AS rep FROM clients 
 LEFT JOIN contacts on clients.contactID = contacts.contactID 
 LEFT JOIN sales_representatives on clients.repID = sales_representatives.repID 
 WHERE clientID = ${req.params.clientID}
 ORDER BY clientID;`
 let query2 = `SELECT * FROM contacts;`;
 let query3 = `SELECT * FROM sales_representatives;`;


 db.connection.query(query1, function(error, rows, fields){    // Execute the query
    if(!error){
    
    let clients = rows;
    
    db.connection.query(query2, function(error, rows, fields){
        if(!error){
            let contacts = rows;

            //run 3rd query for order's sales_representative
            db.connection.query(query3, function(error, rows, fields){
                if(!error){
                    let reps = rows;

                    res.render('update_client',{data: clients, reps: reps, contacts: contacts});

                }
                else{
                    console.log(error);
                }});
            }
        else{
                console.log(error);
            }
        });
    }
    else{
        console.log(error);
    }
    });
 });

//-----------------------------
// CONTACTS PAGE ROUTE
//-----------------------------


app.get('/contacts', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        // Note the call to render() and not send(). Using render() ensures the templating engine
        // Define our query
        let query1;
        if (req.query.lName === undefined && req.query.fName === undefined){
            query1 = "SELECT * FROM contacts;";
        }
        else if (req.query.lName === undefined && req.query.fName !== undefined){
            query1 = `SELECT * FROM contacts WHERE fName LIKE "${req.query.fName}%"`            
        }
        //else
        else{
            query1 = `SELECT * FROM contacts WHERE lName LIKE "${req.query.lName}%"`
        }
        db.connection.query(query1, function(error, rows, fields){    // Execute the query
            
            //get the contacts
            let contacts = rows;
            res.render('contacts',{data: contacts})


        })
    });


//-----------------------------
//ADD CONTACT POST
//-----------------------------

app.post('/add-contact-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
  
        // Create the query and run it on the database
        query1 = `INSERT INTO contacts (fName, lName, email, phone) VALUES ('${data.fName}', '${data.lName}', '${data.email}', '${data.phone}')`;
        db.connection.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on contacts
                query2 = `SELECT * FROM contacts;`;
                db.connection.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

//-----------------------------
//UPDATE CONTACT POST
//-----------------------------

app.post('/update-contact-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
  
        // Create the query and run it on the database
        query1 = `UPDATE contacts SET fName='${data.fName}', lName='${data.lName}', email='${data.email}', phone='${data.phone}' WHERE contactID = ${data.contactID};`;
        db.connection.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on contacts
                query2 = `SELECT * FROM contacts WHERE contactID = ${data.contactID};`;
                db.connection.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

//-----------------------------
//UPDATE CONTACT PAGE
//-----------------------------

app.get('/contact/:contactID', (req, res) =>{

        //Define our query
        let query1 = `SELECT * FROM contacts WHERE contactID = ${req.params.contactID};`;
        
        db.connection.query(query1, function(error, rows, fields){    // Execute the query
            if(!error){
            //get the contact
            let contacts = rows;

            res.render('update_contact',{data: contacts})
 
            }
            else{
                console.log(error);
            };


        }) 
});

//-----------------------------
//DELETE CONTACT
//-----------------------------

app.delete('/contacts/:contactID', (req, res) => {
    db.connection.query(`DELETE FROM contacts WHERE contactID=?;`, [req.params.contactID], function (error, result) {
        if (!error) {
            res.send('Deleted successfully');
        }else{
            console.log(error);
        };
    });
});

//-----------------------------
// ORDERS PAGE ROUTE
//-----------------------------

app.get('/orders', function(req, res)                 
    {
        // Define our query
        let query1;
        let query2 = "SELECT * FROM sales_representatives";
        let query3 = "SELECT * FROM clients";
        if (req.query.orderID === undefined && req.query.repID === undefined && req.query.clientID === undefined){
            
            //general select for orders
            query1 = `SELECT orders.orderID, orders.repID, CONCAT(sales_representatives.fname,' ',sales_representatives.lname) AS rep, orders.clientID, clients.name
                    FROM orders
                    INNER JOIN sales_representatives on orders.repID = sales_representatives.repID
                    INNER JOIN clients on orders.clientID = clients.clientID
                    ORDER BY orderID
                    ;`;

        }
        else if (req.query.orderID === undefined && req.query.repID !== undefined && req.query.clientID === undefined){

                //WHERE repID = ${req.query.repID};
                query1 = `SELECT orders.orderID, orders.repID, CONCAT(sales_representatives.fname,' ',sales_representatives.lname) AS rep, orders.clientID, clients.name
                    FROM orders
                    INNER JOIN sales_representatives on orders.repID = sales_representatives.repID
                    INNER JOIN clients on orders.clientID = clients.clientID
                    WHERE orders.repID = ${req.query.repID}
                    ORDER BY orderID
                    ;`;
          
        }
        else if (req.query.orderID === undefined && req.query.repID === undefined && req.query.clientID !== undefined){

                //WHERE clientID = ${req.query.clientID};
                query1 = `SELECT orders.orderID, orders.repID, CONCAT(sales_representatives.fname,' ',sales_representatives.lname) AS rep, orders.clientID, clients.name
                    FROM orders
                    INNER JOIN sales_representatives on orders.repID = sales_representatives.repID
                    INNER JOIN clients on orders.clientID = clients.clientID
                    WHERE orders.clientID = ${req.query.clientID}
                    ORDER BY orderID
                    ;`;

                        
        }
        //else
        else{

               //WHERE orderID = ${req.query.orderID};
               query1 = `SELECT orders.orderID, orders.repID, CONCAT(sales_representatives.fname,' ',sales_representatives.lname) AS rep, orders.clientID, clients.name
                FROM orders
                INNER JOIN sales_representatives on orders.repID = sales_representatives.repID
                INNER JOIN clients on orders.clientID = clients.clientID
                WHERE orders.orderID = ${req.query.orderID}
                ORDER BY orderID
                ;`;

        }
        
        db.connection.query(query1, function(error, rows, fields){    // Execute the query
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
            //get the orders
            let orders = rows;
            //reps
            db.connection.query(query2, function(error, rows, fields){    // Execute the query
                if (error) {
    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error)
                    res.sendStatus(400);
                }
                else
                {
                //get the orders
                let reps = rows;
                //clients
                db.connection.query(query3, function(error, rows, fields){    // Execute the query
                    if (error) {
        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error)
                        res.sendStatus(400);
                    }
                    else
                    {
                    //get the orders
                    let clients = rows;
                    res.render('orders',{data: orders, reps: reps, clients: clients})
                    
        
                    }
        
                });
    
                }
    
            });

            }

        });
    });

//-----------------------------
//ADD ORDER
//-----------------------------

app.post('/add-order-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    query1 = `INSERT INTO orders (repID, clientID) VALUES (${data.repID}, ${data.clientID})`;
    db.connection.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on contacts
            query2 = `SELECT * FROM orders;`;
            db.connection.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//-----------------------------
//DELETE ORDER
//-----------------------------

app.delete('/orders/:orderID', (req, res) => {
    db.connection.query(`DELETE FROM orders WHERE orderID=?;`, [req.params.orderID], function (error, result) {
        if (!error) {
            res.send('Deleted successfully');
        }else{
            console.log(error)
        };
    });
});

//-----------------------------
//ADD ORDER LINE POST
//-----------------------------

app.post('/add-order-line-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;


    // Create the query and run it on the database
    query1 = `INSERT INTO order_products (orderID, productID, quantity) VALUES (${data.orderID}, ${data.productID}, ${data.quantity})`;
    db.connection.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on contacts
            query2 = `SELECT * FROM order_products;`;
            db.connection.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//-----------------------------
//UPDATE ORDER LINE PAGE
//-----------------------------

app.get('/order_product/:orderID&:productID', (req, res) =>{

 //let query1 = `SELECT * FROM order_products WHERE orderID = ${req.params.orderID} AND productID = ${req.params.productID};`;
 //let query2 =`SELECT * FROM products WHERE productID IN (SELECT productID FROM order_products WHERE orderID = ${req.params.orderID} AND productID = ${req.params.productID});`;
 //let query3 = `SELECT * FROM products;`
    let query1 = `SELECT order_products.orderID AS orderID, order_products.productID AS productID, products.item AS item, products.cost AS cost, order_products.quantity AS quantity, order_products.quantity*products.cost AS total_cost
                FROM order_products                
                INNER JOIN products ON order_products.productID = products.productID
                WHERE order_products.orderID = ${req.params.orderID} AND order_products.productID = ${req.params.productID};`;

    db.connection.query(query1, function(error, rows, fields){    // Execute the query
        if(!error){
        //get the contact
        let order_line = rows;

        
                res.render('update_order_line',{data: order_line})
                
                
        }
        else{
            console.log(error);
        };


    }); 
    });

//-----------------------------
//POST TO UPDATE ORDER LINE
//-----------------------------
app.post('/update-order-line-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
  
        // Create the query and run it on the database
        query1 = `UPDATE order_products SET quantity=${data.quantity} WHERE orderID = ${data.orderID} AND productID =${data.productID};`;
        db.connection.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on contacts
                //query2 = `SELECT * FROM order_products WHERE orderID = ${data.orderID};`;
                query2 = `SELECT order_products.orderID AS orderID, order_products.productID AS productID, products.item AS item, products.cost AS cost, order_products.quantity AS quantity, order_products.quantity*products.cost AS total_cost
                        FROM order_products                
                        INNER JOIN products ON order_products.productID = products.productID
                        WHERE order_products.orderID = ${data.orderID} AND order_products.productID = ${data.productID};`;
                db.connection.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
                
            }
        })
    });


//-----------------------------
//UPDATE ORDER INFORMATION POST
//-----------------------------

app.post('/update-order-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
  
        // Create the query and run it on the database
        query1 = `UPDATE orders SET repID=${data.repID}, clientID=${data.clientID} WHERE orderID = ${data.orderID};`;
        db.connection.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on contacts
                query2 = `SELECT * FROM orders WHERE orderID = ${data.orderID};`;
                db.connection.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
                
            }
        })
    });

//-----------------------------
//UPDATE ORDER PAGE --> MANAGES AN ORDER AND M:M RELATIONSHIP WITH PRODUCTS
//POPULATES ORDER SPECIFIC PART OF INTERMEDIARY ORDER_PRODUCTS TABLE
//-----------------------------

app.get('/order/:orderID', (req, res) =>{
  
    let query1;
    if(req.query.item === undefined)
    {

        //WHERE orderID = ${req.params.orderID};`;

        query1 = `SELECT order_products.orderID, order_products.productID, products.item, order_products.quantity, products.cost AS item_cost, order_products.quantity * products.cost AS total_cost
                FROM order_products
                INNER JOIN products on order_products.productID = products.productID
                WHERE orderID = ${req.params.orderID}
                ORDER BY orderID
                ;`;

    }

    else
    {
        //WHERE orderID = ${req.params.orderID} AND item LIKE "${req.query.item}%";`;
        query1 = `SELECT orders_products.orderID, orders_products.productID, products.item, order_products.quantity * products.cost AS cost
            FROM order_products
            INNER JOIN products on order_products.productID = products.productID
            WHERE order_products.orderID = ${req.params.orderID} AND order_products.item LIKE "${req.query.item}%"
            ORDER BY orderID
            ;`;
        
    }

    let query2 = "SELECT * FROM products;";
    let query3 = `SELECT * FROM sales_representatives WHERE repID IN (SELECT repID FROM orders WHERE orderID = ${req.params.orderID});`;
    let query4 = `SELECT * FROM clients WHERE clientID IN (SELECT clientID FROM orders WHERE orderID = ${req.params.orderID});`;
    let query5 = "SELECT * FROM sales_representatives;";
    let query6 = "SELECT * FROM clients;";
    let query7 = `SELECT * FROM orders WHERE orderID = ${req.params.orderID}`;
    let query8 = `SELECT sum(order_products.quantity * products.cost) AS order_cost FROM order_products
    INNER JOIN products on order_products.productID = products.productID
    WHERE orderID = ${req.params.orderID};`;
    db.connection.query(query1, function(error, rows, fields){    // Execute the query
        if(!error){
        //get the specific order information
        let order_products = rows;
        /*let total;
        for line in order_products{
            total+=x.cost;
        };*/
        
        //run second query
        db.connection.query(query2, function(error, rows, fields){
            if(!error){
                let items = rows;

                //run 3rd query for order's sales_representative
                db.connection.query(query3, function(error, rows, fields){
                    if(!error){
                        let order_rep = rows;
        
                        //run 4th query for order's client
                        db.connection.query(query4, function(error, rows, fields){
                        if(!error){
                            let order_client = rows;
            
                            //run 5th query for sales_representatives list
                            db.connection.query(query5, function(error, rows, fields){
                                if(!error){
                                    let reps = rows;
                    
                                    //run 6th query for clients list
                                    db.connection.query(query6, function(error, rows, fields){
                                    if(!error){
                                        let clients = rows;
                        
                                        //run 7th query for order's ID
                                        db.connection.query(query7, function(error, rows, fields){
                                            if(!error){
                                                let order = rows;
                                

                                                db.connection.query(query8, function(error, rows, fields){
                                                    if(!error){
                                                        let order_cost = rows;
                                                        return res.render('specific_order_products', {data: order_products, items: items, order_rep: order_rep, order_client: order_client, reps: reps, clients: clients, order: order, order_cost: order_cost});
                                                    }else{
                                                        console.log(error);
                                                    }});
                                            }
                                            else{
                                                console.log(error);
                                            }});
                                    }
                                    else{
                                        console.log(error);
                                    }});
                                }
                                else{
                                    console.log(error);
                                }
                            });
                        }
                        else{
                            console.log(error);
                        }});
                    }
                    else{
                        console.log(error);
                    }
                });
            }
            else{
                console.log(error);
            }
        });

        //res.render('specific_order_products',{data: order_products})

        }
        else{
            console.log(error);
        };


    }) 
});

//-----------------------------
//DELETE ORDER LINE
//-----------------------------

app.delete('/order_product/:orderID&:productID', (req, res) => {
    db.connection.query(`DELETE FROM order_products WHERE orderID=? AND productID=?;`, [req.params.orderID,req.params.productID], function (error, result) {
        if (!error) {
            res.send('Deleted successfully');
        }else{
            console.log(error);
        };
    });
});

//-----------------------------
// PRODUCTS PAGE ROUTE
//-----------------------------

app.get('/products', function(req, res)                 // This is the basic syntax for what is called a 'route'
{
    if (req.query.item === undefined && req.query.cost === undefined){
        query1 = "SELECT * FROM products;";
    }
    else if (req.query.item === undefined && req.query.cost !== undefined){
        query1 = `SELECT * FROM products WHERE cost = "${req.query.cost}%"`            
    }
    
    else{
        query1 = `SELECT * FROM products WHERE item LIKE "${req.query.item}%"`
    }
    db.connection.query(query1, function(error, rows, fields){    // Execute the query
        
        
        let products = rows;
        res.render('products',{data: products})
    })       

});

//-----------------------------
//DELETE PRODUCTS
//-----------------------------

app.delete('/products/:productID', (req, res) => {
    db.connection.query(`DELETE FROM products WHERE productID=?;`, [req.params.productID], function (error, result) {
        if (!error) {
            res.send('Deleted successfully');
        }else{
            console.log(error)
        };
    });
});

//-----------------------------
//ADD PRODUCT POST
//-----------------------------

app.post('/add-product-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
  
        // Create the query and run it on the database
        query1 = `INSERT INTO products (item, cost) VALUES ('${data.item}', '${data.cost}')`;
        db.connection.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on contacts
                query2 = `SELECT * FROM products;`;
                db.connection.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

//-----------------------------
//UPDATE PRODUCT POST
//-----------------------------

app.post('/update-product-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
  
        // Create the query and run it on the database
        query1 = `UPDATE products SET item='${data.item}', cost='${data.cost}' WHERE productID = ${data.productID};`;
        db.connection.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on contacts
                query2 = `SELECT * FROM products WHERE productID = ${data.productID};`;
                db.connection.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });
//-----------------------------
//UPDATE PRODUCT PAGE
//-----------------------------

app.get('/products/:productID', (req, res) =>{
           //res.render('contacts')                     // Note the call to render() and not send(). Using render() ensures the templating engine
        //let query1 = "SELECT * FROM contacts;";               // Define our query
        let query1 = `SELECT * FROM products WHERE productID = ${req.params.productID};`;
        
        db.connection.query(query1, function(error, rows, fields){    // Execute the query
            if(!error){
            //get the contact
            let products = rows;

            res.render('update_product',{data: products})
 
            }
            else{
                console.log(error);
            };


        }) 
});
//-----------------------------
// SALES_REPRESENTATIVES PAGE
//-----------------------------

app.get('/sales_representatives', function(req, res)                 
{
    
    let query1;
        if (req.query.lName === undefined && req.query.fName === undefined){
            query1 = "SELECT * FROM sales_representatives;";
        }
        else if (req.query.lName === undefined && req.query.fName !== undefined){
            query1 = `SELECT * FROM sales_representatives WHERE fName LIKE "${req.query.fName}%"`            
        }
        
        else{
            query1 = `SELECT * FROM sales_representatives WHERE lName LIKE "${req.query.lName}%"`
        }
        db.connection.query(query1, function(error, rows, fields){    // Execute the query
            
            
            let sales_representatives = rows;
            res.render('sales_representatives',{data: sales_representatives})
        })                                    

});

//-----------------------------
//DELETE SALES_REPRESENTATIVES
//-----------------------------

app.delete('/sales_representatives/:repID', (req, res) => {
    db.connection.query(`DELETE FROM sales_representatives WHERE repID=?;`, [req.params.repID], function (error, result) {
        if (!error) {
            res.send('Deleted successfully');
        }else{
            console.log(error);
        };
    });
});

//-----------------------------
//ADD SALES_REPRESENTATIVES
//-----------------------------

app.post('/add-salesRep-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
  
        // Create the query and run it on the database
        query1 = `INSERT INTO sales_representatives (fName, lName, email, phone) VALUES ('${data.fName}', '${data.lName}', '${data.email}', '${data.phone}')`;
        db.connection.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on contacts
                query2 = `SELECT * FROM sales_representatives;`;
                db.connection.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

//-----------------------------
//UPDATE SALES_REPRESENTATIVES POST
//-----------------------------

app.post('/update-sales_rep-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
  
        // Create the query and run it on the database
        query1 = `UPDATE sales_representatives SET fName='${data.fName}', lName='${data.lName}', email='${data.email}', phone='${data.phone}' WHERE repID = ${data.repID};`;
        db.connection.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on contacts
                query2 = `SELECT * FROM sales_representatives WHERE repID = ${data.repID};`;
                db.connection.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

//-----------------------------
//UPDATE SALES_REPRESENTATIVES PAGE
//-----------------------------

app.get('/sales_representatives/:repID', (req, res) =>{
        
        // Define our query
        let query1 = `SELECT * FROM sales_representatives WHERE repID = ${req.params.repID};`;
        
        db.connection.query(query1, function(error, rows, fields){    // Execute the query
            if(!error){
            //get the contact
            let sales_representatives = rows;

            res.render('update_sales_rep',{data: sales_representatives})
 
            }
            else{
                console.log(error);
            };


        }) 
});

//Listener

app.listen(PORT, function(){            
    console.log('Express started on localhost:' + PORT + '; press Ctrl-C to terminate.')
});