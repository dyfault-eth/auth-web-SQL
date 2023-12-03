const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = () => {
    return mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: process.env.PASSWORD,
        database: "db1",
    });
};

module.exports = connectDB;