
var express = require("express");
var app = express();
var mysql = require("mysql");
//Database connection
app.use(function(req, res, next){
	res.locals.connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : ' ',
		database : 'servel'
	});
	res.locals.connect();
	next();
});
