const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "Varulf!2003#",
    host: "localhost",
    port: 5432,
    database: "GoogleEvents" // Add the name of your database here
});

pool.query('');
module.exports = pool;
