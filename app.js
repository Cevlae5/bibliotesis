const express = require('express')
const bodyParser = require('body-parser');
const app = express()
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bibliotesis"
});
con.connect(function(err) {
  if (err) throw err;  
});

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('index', { error: null,resultado : null});
    
})




app.get('/home', function (req, res) {
    res.render('home', { error: 'tuve un error!',resultado : null});
    con.query("select * from tesis" , function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.render("home",{tesis:result})
    i
        
      });
})

app.post("/archivo",function (req, res) {
    let archivo = req.body;
    con.query(query , function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        if(result.length>0){
            res.render('tesis', { mensaje:"se subio bien el documento",error: null});
        }else{
            res.render('login', { mensaje:null,error: 'no pude subir la wea'});
        }
        
      });
})

app.get('/login', function (req, res) {
    res.render('login', { error: null,user : null});
})
app.post('/login', function (req, res) {
    let user = req.body;    
    let query = "SELECT * FROM usuario where correo = '"+user.correo +"' and clave = '"+ user.clave + " ' ";

    console.log(query);
    con.query(query , function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        if(result.length>0){
            res.render('login', { error: null,user : req.body});
        }else{
            res.render('login', { error: 'no encontre al culiao',user : req.body});
        }
        
      });
    
})


app.get('/register', function (req, res) {
    res.render('register', { error: null,resultado : null});
})
app.post('/register', function (req, res) {
    res.render('register', { error: null,resultado : null});
})



app.get('/login/falso', function (req, res) {
    res.render('login', { error: null,user : null});
})


// abrir el servidor con el puerto de la variable puerto
let puerto = 4000;
app.listen(puerto, function () {
  console.log('escuchando puerto '+puerto+'!')
})
