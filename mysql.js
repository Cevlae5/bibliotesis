var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "789123",
  database: "servel"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM persona", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});
