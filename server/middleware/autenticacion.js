const jwt = require('jsonwebtoken');
// Verificar token

let verificaToken = (req, res, next)=>{
    let token = req.get('authorization');
    jwt.verify(token, process.env.SEED,(err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err
            })
        }

        //decoded viene siendo el payload ya decodificado al ejecutarse bien la valdiacion
        req.usuario = decoded.usuario;
        next();
    });
};

let verificaAdmin_Role=(req, res, next)=>{
    let usuario = req.usuario;
    if(usuario.role==='ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok:false,
            err:{
                message: 'El usuario No es Administrador'
            }
        })
    }
}



module.exports = {
    verificaToken,
    verificaAdmin_Role
}