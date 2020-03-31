'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//cargar rutas
var user_routes = require('./routes/user');

//midlewares de body-parser
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//configurar cabeceras u cors

app.use('/api', user_routes);

//rutas body-parser
module.exports = app;
