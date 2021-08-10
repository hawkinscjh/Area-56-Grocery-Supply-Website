
-- MySQL dump for project database in CS340.
-- -------------------------------------


-- PART A ----------------------------
--
DROP TABLE IF EXISTS order_products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS sales_representatives;
DROP TABLE IF EXISTS products;


--
-- Table structure for table contacts
--

CREATE TABLE contacts(
    contactID int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    fName varchar(255) NOT NULL,
    lName varchar(255) NOT NULL,
    email varchar(255),
    phone varchar(255)

);

--
-- Table structure for table sales_representatives
--


CREATE TABLE sales_representatives(
    repID int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    fName varchar(255) NOT NULL,
    lName varchar(255) NOT NULL,
    email varchar(255),
    phone varchar(255)

);

--
-- Table structure for table clients
--

CREATE TABLE clients(
    clientID int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    address varchar(255) NOT NULL,
    email varchar(255),
    phone varchar(255),
    contactID int(11),
    repID int(11),

    FOREIGN KEY clients_ibfk_1  (contactID) REFERENCES contacts(contactID) ON DELETE SET NULL,
    FOREIGN KEY clients_ibfk_2 (repID) REFERENCES sales_representatives(repID) ON DELETE SET NULL

);


--
-- Table structure for table orders
--


CREATE TABLE orders(
    orderID int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    repID int(11) NOT NULL,
    clientID int(11) NOT NULL,
    FOREIGN KEY orders_ibfk_1 (clientID) REFERENCES clients(clientID) ON DELETE CASCADE,
    FOREIGN KEY orders_ibfk_2 (repID) REFERENCES sales_representatives(repID) ON DELETE CASCADE 


);


--
-- Table structure for table products
--


CREATE TABLE products(
    productID int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    item varchar(255) NOT NULL,
    cost int(11) NOT NULL

);


--
-- Table structure for table order_products
--


CREATE TABLE order_products(
    orderID int(11) NOT NULL,
    productID int(11) NOT NULL,
    quantity int(11) NOT NULL,
    FOREIGN KEY order_prods_ibfk_1 (orderID) REFERENCES orders(orderID) ON DELETE CASCADE,
    FOREIGN KEY order_prods_ibfk_2 (productID) REFERENCES products (productID) ON DELETE CASCADE,
    PRIMARY KEY (productID,orderID)

);


--
-- PART B ----------------------------
--

--
-- Add contacts.
--

INSERT INTO contacts (fname, lname, email, phone) VALUES ("Elvis", "Presley", "epresley@aol.com", "323-555-5555");
INSERT INTO contacts (fname, lname, email, phone) VALUES ("Elvis", "Costello", "ecostello@aol.com", "310-222-2222");
INSERT INTO contacts (fname, lname, email, phone) VALUES ("Buddy", "Holly", "bholly@gmail.com", "323-191-9151");
INSERT INTO contacts (fname, lname, email, phone) VALUES ("Taylor", "Swift", "tswift@gmail.com", "323-654-7888");

--
-- Add sales representatives.
--

INSERT INTO sales_representatives (fname, lname, email, phone) VALUES ("John", "Lennon", "jlennon@gmail.com", "323-616-6626");
INSERT INTO sales_representatives (fname, lname, email, phone) VALUES ("Paul", "McCartney", "pmccartney@gmail.com", "323-881-1888");
INSERT INTO sales_representatives (fname, lname, email, phone) VALUES ("Ringo", "Starr", "rstarr@gmail.com", "323-255-5225");

--
-- Add clients.
--

INSERT INTO clients (name, address, email, phone, contactID, repID) VALUES ("Big Grocers", "151 North Ln, Des Moines, IA 50061", "biggrocers@gmail.com", "515-789-9987", 1, 1);
INSERT INTO clients (name, address, email, phone, contactID, repID) VALUES ("Best Stuff", "997 West Dr, Houston, TX 77002", "beststuff@gmail.com", "281-753-1159", 2, 2);
INSERT INTO clients (name, address, email, phone, contactID, repID) VALUES ("Wholesome Foods", "636 Downtown Blvd, San Francisco, CA 94108", "wholesomefoods@gmail.com", "415-395-2252", 3, 3);

--
-- Add orders.
--

INSERT INTO orders (repID, clientID) VALUES (1, 1);
INSERT INTO orders (repID, clientID) VALUES (2, 2);
INSERT INTO orders (repID, clientID) VALUES (3, 3);

--
-- Add products.
--


INSERT INTO products (item, cost) VALUES ("Banana", 1);
INSERT INTO products (item, cost) VALUES ("Apple", 1);
INSERT INTO products (item, cost) VALUES ("Chicken", 10);
INSERT INTO products (item, cost) VALUES ("Salmon", 20);
INSERT INTO products (item, cost) VALUES ("Bread", 3);
INSERT INTO products (item, cost) VALUES ("Milk", 4);
INSERT INTO products (item, cost) VALUES ("Carton of Eggs", 2);
INSERT INTO products (item, cost) VALUES ("Coffee Beans", 8);
INSERT INTO products (item, cost) VALUES ("Broccoli", 3);
INSERT INTO products (item, cost) VALUES ("Carrots", 2);

--
-- Add products to orders via order_products table (M:M relationship)
--

INSERT INTO order_products (orderID, productID, quantity) VALUES (1, 1, 100);
INSERT INTO order_products (orderID, productID, quantity) VALUES (2, 5, 50);
INSERT INTO order_products (orderID, productID, quantity) VALUES (3, 8, 25);