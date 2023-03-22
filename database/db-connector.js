// ./database/db-connector.js

// Get an instance of mysql we can use in the app
/*const mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    host            : 'area56db.cqundkvbdrrd.us-east-2.rds.amazonaws.com',
    port            : '3306',
    user            : 'admin',
    password        : 'Hawkins32'
})

// Export it for use in our applicaiton
module.exports.pool = pool;*/

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'area56db.cqundkvbdrrd.us-east-2.rds.amazonaws.com',
  user     : 'admin',
  password : 'Hawkins32',
  port     : '3306',
  database  : 'area56db'
});

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');
});

//connection.end();