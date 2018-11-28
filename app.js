const express = require('express')
const bodyParser = require('body-parser');
var mysql = require('mysql');
const app = express()

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "789123",
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



app.get('/mandar', function (req, res) {    
    res.render("mandarCorreo",{resultado:null}); 
})
app.post('/mandar', function (req, res) {
    data = req.body;
    cuando = data.cuando;
    to = data.para;
    mensaje = data.mensaje;
    subject = data.subject;
    console.log(data);
    (async function() {
        await agenda.start();
        await agenda.schedule(cuando, 'correo desde gmail', {subject:subject,para: to , texto:mensaje});        
      })();
    res.render("mandarCorreo",{resultado:"se agendó con exito"}); 
})

app.get('/home', function (req, res) {
    res.render('home', { error: 'tuve un error!',resultado : null});
    con.query("select * from tesis" , function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.render("home",{tesis:result});            
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
    let query = "SELECT * FROM Usuario where rut = '"+user.rut +"' and clave = '"+ user.clave + " ' ";

    console.log(query);
    con.query(query , function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        if(result.length>0){
            res.render('home', { error: null,user : req.body});
        }else{
            res.render('login', { error: 'Usuario no encotrado',user : req.body});
        }
        
      });
    
})


app.get('/register', function (req, res) {
    res.render('register', { error: null,resultado : null});
})
app.post('/register', function (req, res) {
    res.render('register', { error: null,resultado : null});
})

app.get("/users",function (req,res){
    let query = " SELECT * from Usuario ";
    con.query(query , function (err, result, fields) {
        if (err) throw err;
        //
        if(result.length>0){
            res.render('userControl', { error: null,usuarios : result});
        }else{
            res.render('userControl', { error: 'fallo el sql',usuarios : [] });
        }        
    });
    
})

app.post("/users/delete",function (req,res){
    let user = req.body; 
    let query = " DELETE FROM Usuario where idUsuario = "+user.id;
    console.log(query);
    con.query(query , function (err, result, fields) {
        if (err) throw err;
        res.redirect("/users");
    });
    
})
app.post("/users/replace",function (req,res){
    let user = req.body; 
    let query = "REPLACE INTO Usuario (idUsuario, rut, nombre, apellido, correo, clave) VALUES ("+user.id+", '"+user.rut+"', '"+user.nombre+"', '"+user.apellido+"', '"+user.correo+"', '"+user.correo+"') ";
    console.log(query);
    con.query(query , function (err, result, fields) {
        if (err) throw err;
        res.redirect("/users");
    });
    
})



// abrir el servidor con el puerto de la variable puerto
let puerto = 4000;
app.listen(puerto, function () {
  console.log('escuchando puerto '+puerto+'!')
})
