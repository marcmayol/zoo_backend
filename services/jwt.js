'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
let secret = 'calve_secreta_del_curso_de angular';
exports.createToken = function (user) {
    var payload = {
        sub: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };


    return jwt.encode(payload, secret);
};
