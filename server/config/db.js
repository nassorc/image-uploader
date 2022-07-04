const mysql = require('mysql2');
require('dotenv').config();
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    database        : process.env.DB_NAME,
    password        : ''
}).promise();


module.exports = pool;