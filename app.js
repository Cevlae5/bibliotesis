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
var User = {
    idUsuario : null,
    rut : null,
    nombre : null,
    apellido : null,
    correo : null,
    clave : null
};

///////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', function (req, res) {    
    if(validar()){
        let query = "select * from Tesis";    
        con.query(query , function (err, result, fields) {
            if (err) throw err;
            //
            if(result.length>0){
                res.render('home', { error: null,tesis : result});
            }else{
                res.render('home', { error: 'No hay tesis para mostrar',tesis : [] });
            }        
        });
    }else{
        res.redirect("/login");
    }
})


/*
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
*/


///////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/login', function (req, res) {
    res.render('login', { error: null,user : null});
})
app.post('/login', function (req, res) {
    let user = req.body;    
    let query = "SELECT * FROM Usuario where rut = '"+user.rut +"' and clave = '"+ user.clave + " ' ";
    console.log(query);
    con.query(query , function (err, result, fields) {
        if (err) throw err;
        User = result[0];
        console.log(User);
        if(result.length>0){
            res.redirect("/");
        }else{
            res.render('login', { error: 'Usuario no encotrado',user : req.body});
        }
        
      });
    
})

///////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/register', function (req, res) {
    res.render('register', { error: null,resultado : null});
})
app.post('/register', function (req, res) {
    let user = req.body;    
    let query = "INSERT INTO Usuario (idUsuario, rut, nombre, apellido, correo, clave) VALUES ("+Math.round(Math.random()*100)+", '"+user.rut+"', '"+user.nombre+"', '"+user.apellido+"', '"+user.correo+"', '"+user.clave+"') ";    
        console.log(query);
        con.query(query , function (err, result, fields) {
        if (err)  res.render('login', { error: 'no',user : req.body});
        res.redirect("/");
        
        
      });
})   
///////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/users",function (req,res){    
    if(validar()){
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
    }else{
        res.redirect("/login");
    }
})

app.post("/users/delete",function (req,res){
    if(validar()){
        let user = req.body; 
        let query = " DELETE FROM Usuario where idUsuario = "+user.id;
        console.log(query);
        con.query(query , function (err, result, fields) {
            if (err) throw err;
            res.redirect("/users");
        });        
    }else{
        res.redirect("/");
    }
})
app.post("/users/replace",function (req,res){
    if(validar()){
        let user = req.body; 
        let query = "REPLACE INTO Usuario (idUsuario, rut, nombre, apellido, correo, clave) VALUES ("+user.id+", '"+user.rut+"', '"+user.nombre+"', '"+user.apellido+"', '"+user.correo+"', '"+user.correo+"') ";
        console.log(query);
        con.query(query , function (err, result, fields) {
            if (err) throw err;
            res.redirect("/users");
        });
    }else{
        res.redirect("/login");
    }    
})
///////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/tesis/:id', function(req, res) {
    if(validar()){
        let query = "SELECT * FROM Tesis where idTesis = "+req.params.id;
        
        con.query(query , function (err, result, fields) {
            if (err) throw err;
            console.log(result[0]);
            if(result.length>0){
                res.render('tesis', { error: null,tesis : result[0]});
            }else{
                res.render('tesis', { error: "no se encuentra esta tesis",tesis : [] });
            }        
        });
    }else{
        res.redirect("/login");
    }
  });

///////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/fileadd', function (req, res) {
    if(validar()){
        res.render('fileadd', { error: null,resultado : null});
    }else{
        res.redirect("/login");
    }
    
})
app.post("/fileadd",function (req,res){
    if(validar()){    
        let tesis = req.body; 
        let query = "INSERT INTO tesis (idTesis, titulo, descripcion, codigo) VALUES ("+Math.round(Math.random()*100)+", '"+tesis.titulo+"', '"+tesis.descripcion+"', '"+tesis.codigo+"') ";
        console.log(query);
        console.log(tesis);
            console.log(query);
            con.query(query , function (err, result, fields) {
            if (err)  res.render('fileadd', { error: 'no',tesis : req.body});
            res.redirect("/");
        });
    }else{
        res.redirect("/login");
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/evaluacion', function (req, res) {
    
    if(validar()){    
        res.render('evaluacion', { error: null,resultado : null});
    }else{
        res.redirect("/login");
    }
})
app.post('/evaluacion', function (req, res) {
    if(validar()){    
        let eval = req.body;    
        let query = "INSERT INTO evaluacion (nota, comentarios) VALUES ('"+eval.nota+"', '"+eval.comentarios+"') ";    
            con.query(query , function (err, result, fields) {
            if (err) throw err;
            res.redirect("/");                
        });
    }else{
        res.redirect("/login");
    }
})
///////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/salir",function(req,res){
    salir();
    res.redirect("/login");
});
///////////////////////////////////////////////////////////////////////////////////////////////////
// abrir el servidor con el puerto de la variable puerto
let puerto = 4000;
app.listen(puerto, function () {
  console.log('escuchando puerto '+puerto+'!')
})


function validar(){
    
    if(User.rut != null){
        return true;
    }else{
        return false;
    }
}
function salir(){
    User = {
        idUsuario : null,
        rut : null,
        nombre : null,
        apellido : null,
        correo : null,
        clave : null
    };
}