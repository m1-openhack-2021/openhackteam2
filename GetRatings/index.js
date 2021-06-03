// Azure Function: Node.js code to read PostgreSQL data and return results as JSON

// Import the pg (node-postgres) library
const pg = require('pg');

// Entry point of the function
module.exports = async function(context, req) {

    // Define variables to store connection details and credentials
    const config = {
        host: process.env["POSTGRES_SERVER_NAME"],
        user: process.env["POSTGRES_USER_NAME"],
        password: process.env["POSTGRES_USER_PASS"],
        database: 'icecream',
        port: 5432,
        ssl: true
    };

    // Create query to execute against the database
    const querySpec = {
        //text: 'SELECT * FROM Rating'
       text: "SELECT * FROM Rating WHERE userid='" + req.query.userId + "'"
    }

    try {
        // Create a pool of connections
        const pool = new pg.Pool(config);

        // Get a new client connection from the pool
        const client = await pool.connect();

        // Execute the query against the client
        const result = await client.query(querySpec);

        // Release the connection
        client.release();

        // Return the query resuls back to the caller as JSON
        context.res = {
            status: 200,
            isRaw: true,
            body: result.rows,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (err) {
        context.log(err.message);
    }
}
