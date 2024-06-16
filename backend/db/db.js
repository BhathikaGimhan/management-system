const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootAdmin",
  database: "paint_shop",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting o database:", err);
    return;
  }
  console.log("Connected to database");
});

module.exports = connection;
