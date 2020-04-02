'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
let secret = 'calve_secreta_del_curso_de angular';
var payload
exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});

    }
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'El token ha expirado'

            });

        }

    } catch (ex) {
        return res.status(404).send({
            message: 'El token no es válido'

        });
    }
    req.user = payload;
    next();
};
