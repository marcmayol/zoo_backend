'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
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
                        user.password="";
                        //devolver token jwt
                        res.status(200).send({
                            user:user,
                            token: jwt.createToken(user)
                        });
                    } else {
                        res.status(401).send({message: 'El usuario no se ha podido loguearse correctamente'});
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
    delete update.password;
    if (userId !== req.user.sub) {
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

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No subido...';
    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('/');
        file_name = file_split[2];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];
        if (userId !== req.user.sub) {
            return res.status(403).send({
                message: 'No tienes permiso'
            });
        }
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            userModel.findByIdAndUpdate(userId, {image: file_name}, {new: true}, (err, userUpdated) => {
                if (err) {
                    return res.status(500).send({
                        message: 'Error al actualizar usuario' + err
                    });
                } else {
                    if (!userUpdated) {
                        return res.status(404).send({
                            message: 'NO se ha podido actualizar el usuario'
                        });
                    } else {
                        return res.status(200).send({userUpdated, image: file_name});
                    }
                }
            });
        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(404).send({
                        message: 'extensión no válida y fichero no borrado'
                    });
                } else {
                    res.status(404).send({
                        message: 'extensión no válida'
                    });
                }

            });

        }

    } else {
        res.status(404).send({
            message: 'No se han subido los archivos'
        });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({
                message: 'la imagen no existe'
            });
        }

    });

}

function getKeepers(req, res) {
    userModel.find({role: "ROLE_ADMIN"}).exec((err, users) => {
        if (err) {
            res.status(500).send({
                message: 'error en la petición'
            });
        } else {
            if (!users) {
                res.status(404).send({
                    message: 'No hay cuidadores'
                });

            } else {
                res.status(200).send({users});
            }

        }


    });

}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile,
    getKeepers
};
