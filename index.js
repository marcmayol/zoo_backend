'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zoo', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(
    () => {
        console.log('La conexión a la base de datos zoo se ha realizado correctame... en http://localhost:3789');
        app.listen(port, ()=>{
            console.log('El servidor local con Node y Express está corriendo correctamente...');
        });
    }).catch(err => console.log(err));
