'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var animal_routes = require('./routes/animal');

//midlewares de body-parser
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//configurar cabeceras u cors
app.use((req,res,next)=>{
res.header('Access-Control-Allow-Origin','*');
res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-ControlAllow-Request-Method');
res.header('Access-control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
next();
});

app.use('/api', user_routes);
app.use('/api', animal_routes);

//rutas body-parser
module.exports = app;
