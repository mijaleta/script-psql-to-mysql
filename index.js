
// i have included the following isnide the database 
/**
 * 
 * 1. Create a Trigger Function in PostgreSQL
You can create a trigger function that will execute whenever a new row is inserted into the employees table. This function can send a notification that the data has been added.

sql
Copy code
CREATE OR REPLACE FUNCTION notify_new_employee()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('new_employee', NEW.name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 * 
 */


// also the following

/**
 * 
 * 
 * 2. Create a Trigger
Next, create a trigger that will call the function whenever a new row is inserted:

sql
Copy code
CREATE TRIGGER employee_insert_trigger
AFTER INSERT ON employees
FOR EACH ROW
EXECUTE FUNCTION notify_new_employee();
 */
const { Client } = require('pg');
// const mysql = require('mysql');
const mysql = require('mysql2');

// PostgreSQL connection
const pgClient = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'lama',
    password: 'ammaAMMA1!',
    port: 5432,
});

// MySQL connection (or same PostgreSQL connection)
const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ammaAMMA1!',
    database: 'lama',
});


// 
async function listenForNewEmployees() {
    await pgClient.connect();
    
    // Listen for notifications on the 'new_employee' channel
    pgClient.query('LISTEN new_employee');
    
    pgClient.on('notification', async (msg) => {
        const newName = msg.payload; // Get the new employee name

        // Insert the new name into the MySQL database (or the same PostgreSQL table)
        const query = 'INSERT INTO employees (name) VALUES (?)';
        mysqlConnection.query(query, [newName], (error) => {
            if (error) throw error;
        });

        console.log(`Inserted new employee: ${newName}`);
    });
}

// Start listening for new employee notifications
listenForNewEmployees();
