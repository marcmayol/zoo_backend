'use strict'
//modulos
var fs = require('fs');
var path = require('path');

//modelos
var userModel = require('../models/user');
var animalModel = require('../models/animal');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando el controlador de animales y la acción pruebas',
        user: req.user
    });

}

function saveAnimal(req, res) {
    var animal = new animalModel();
    var params = req.body;

    if (params.name) {
        animal.name = params.name;
        animal.description = params.description;
        animal.year = params.year;
        animal.image = null;
        animal.user = req.user.sub;
        animal.save((err, animalStored) => {
            if (err) {
                res.status(500, {
                    message: 'error en el servidor'
                });
            } else {
                if (!animalStored) {
                    return res.status(404).send({
                        message: 'no se ha guardado el animal'
                    });
                } else {
                    return res.status(200).send({
                        animal: animalStored
                    });

                }
            }

        });
    } else {
        res.status(401).send({
            message: 'El nombre es obligatorio',
        });
    }


}

function getAnimals(req, res) {
    animalModel.find({}, (err, animals) => {
        if (err) {
            res.status(500).send({
                message: 'error en la petición' + err,

            });
        } else {
            userModel.populate(animals, {path: "user"}, function (err, animals) {
                if (err) {
                    res.status(500).send({message: 'error en la petición' + err});
                } else {
                    if (!animals) {
                        res.status(404).send({message: 'no hay animales'});
                    } else {
                        res.status(200).send({animals});
                    }
                }


            });
        }
    });
}

function getAnimal(req, res) {
    let animalId = req.params.id;
    animalModel.findById(animalId, (err, animal) => {
        if (err) {
            res.status(500).send({
                message: 'error en la petición' + err,

            });
        } else {
            userModel.populate(animal, {path: "user"}, function (err, animal) {
                if (err) {
                    res.status(500).send({message: 'error en la petición' + err});
                } else {
                    if (!animal) {
                        res.status(404).send({message: 'el animal no existe'});
                    } else {
                        res.status(200).send({animal});
                    }
                }


            });
        }
    });
}

function updateAnimal(req, res) {
    let animalId = req.params.id;
    let update = req.body;
    animalModel.findByIdAndUpdate(animalId, update, {new: true}, (err, animalupdate) => {
        if (err) {
            res.status(500).send({
                message: 'error en la petición' + err,

            });
        } else {
            if (!animalupdate) {
                res.status(404).send({message: 'no se ha actualizado el animal'});
            } else {
                res.status(200).send({animal: animalupdate});
            }
        }
    });

}
function uploadImage(req, res) {
    var animalID = req.params.id;
    var file_name = 'No subido...';
    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('/');
        file_name = file_split[2];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];
        if (animalID !== req.user.sub) {
            return res.status(403).send({
                message: 'No tienes permiso'
            });
        }
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            animalModel.findByIdAndUpdate(animalID, {image: file_name}, {new: true}, (err, animalUpdate) => {
                if (err) {
                    return res.status(500).send({
                        message: 'Error al actualizar usuario' + err
                    });
                } else {
                    if (!animalUpdate) {
                        return res.status(404).send({
                            message: 'NO se ha podido actualizar el usuario'
                        });
                    } else {
                        return res.status(200).send({animal: animalUpdate, image: file_name});
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
    var path_file = './uploads/animals/' + imageFile;

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

function deleteAnimal(req, res){
    var animalID = req.params.id;

    animalModel.findByIdAndRemove(animalID, (err, animalremoved)=>{
        if(err){
            res.status(500).send({
                message: 'Error en la peticón'
            });
        }else{
            if(!animalremoved){
                res.status(401).send({
                    message: 'No se ha borrado el animal'
                });
            }else{
                return res.status(200).send({animal: animalremoved});
            }
        }

    });

}

module.exports = {
    pruebas,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal,
    uploadImage,
    getImageFile,
    deleteAnimal
};
