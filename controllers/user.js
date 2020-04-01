'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');
//modelos
var User = require('../models/user');

function pruebas(req, res) {
    res.status(200).send({message: 'Probando el controlador de usuarios y la cción pruebas'});

}

function saveUser(req, res) {

    //creadno objeto usuario
    var user = new User();
    //recoger parametros petición
    var params = req.body;

    if (params.password && params.name && params.surname && params.email) {
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        User.findOne({email: user.email.toLowerCase()}, (err, user) => {
            if (err) {
                res.status(500).send({message: 'Error al guardar el usuario'});
            } else {
                if (!user) {
                    //cifrar password
                    console.log(params.password);
                    bcrypt.hash(params.password, null, null, function (err, hash) {
                        console.log(hash);
                        user.password = hash;
                        //guardar usuarioen db
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({message: 'Error al guardar el usuario'});
                            } else {
                                if (!userStored) {
                                    res.status(404).send({message: 'N se ha resgistrado el usuario'});
                                } else {
                                    res.status(202).send({user: userStored});
                                }
                            }
                        });
                    });
                } else {
                    res.status(200).send({message: 'El usuario ya existe'});
                }
            }
        });


    } else {
        res.status(200).send({message: 'Introduce los datos correctamente para registrar el usuario'});
    }


}

module.exports = {
    pruebas,
    saveUser
};
