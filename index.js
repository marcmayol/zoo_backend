'use strict'

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zoo', { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        console.log('La conexión a la base de datos zoo se ha realizado correctame...');
    }).catch(err => console.log(err));
