'use strict'
exports.isAdmin = function(req,res,next){
    if(req.user.role !='ROLE_ADMIN'){
        return res.status(200).send({message: 'no es admin'})
    }
    next();


};
