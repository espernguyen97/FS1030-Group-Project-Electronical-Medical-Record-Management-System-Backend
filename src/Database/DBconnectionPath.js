const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "emrsystem_admin",
  password: "12345678",
  database: "emrsystem",
});

connection.connect(function (err){
 if (err){
     console.log(err);
 } else{
     console.log("MySQL database is connected");
 }
});

module.exports = connection;
