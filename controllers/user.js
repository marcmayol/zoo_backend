'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
//modelos
var userModel = require('../models/user');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de usuarios y la acción pruebas',
        user: req.user
    });

}

function saveUser(req, res) {

    //creadno objeto usuario
    var user = new userModel();
    //recoger parametros petición
    var params = req.body;

    if (params.password && params.name && params.surname && params.email) {
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        userModel.findOne({email: user.email.toLowerCase()}, (err, resuser) => {
            if (err) {
                res.status(500).send({message: 'Error al guardar el usuario'});
            } else {
                if (!resuser) {
                    //cifrar password
                    console.log(params.password);
                    bcrypt.hash(params.password, null, null, function (err, hash) {
                        params.password = hash;
                        user.password = '' + params.password;
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

function login(req, res) {
    let params = req.body;
    let email = params.email;
    let password = params.password;

    userModel.findOne({email: email.toLowerCase()}, (err, user) => {
        if (err) {
            res.status(500).send({message: 'Error al guardar el usuario'});
        } else {
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        if (params.gettoken) {
                            //devolver token jwt
                            res.status(200).send({
                                toekn: jwt.createToken(user)
                            });

                        } else {
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({message: 'El usuario no se ha podido loguearse correctamente'});
                    }

                });

            } else {
                res.status(404).send({message: 'El usuario no existe'});
            }
        }

    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
    if (userId != req.user.sub) {
        return res.status(403).send({
            message: 'No tienes permiso'
        });
    }

    userModel.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al actualizar usuario'
            });
        } else {
            if (!userUpdated) {
                return res.status(404).send({
                    message: 'NO se ha podido actualizar el usuario'
                });
            } else {
                res.status(200).send({user: userUpdated})
            }
        }
    });

}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser
};
