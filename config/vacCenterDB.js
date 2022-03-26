const mysql = require("mysql2");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "vacCenter",
});

module.exports = connection;
