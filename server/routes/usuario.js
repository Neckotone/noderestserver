const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const {verificaToken, verificaAdmin_Role} = require('../middleware/autenticacion')
const bcrypt = require('bcrypt');
const _ = require('underscore'); //para seleccionar claves de objetos

app.get('/usuario',verificaToken, (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)
    let limite = req.query.limite || 5
    limite = Number(limite)
    Usuario.find({estado:true},'nombre email role estado google img')  //busqueda y select de campos
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            
            Usuario.count({estado:true}, (err, conteo)=>{
                res.json({
                    ok: true,
                    usuarios,
                    conteo:conteo
                });
            })
                
            
        })
})

app.post('/usuario',[verificaToken,verificaAdmin_Role], (req, res) => {
    let persona = req.body;
    let usuario = new Usuario({
        nombre: persona.nombre,
        email: persona.email,
        password: bcrypt.hashSync(persona.password, 10),
        role: persona.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //usuarioDB.password = null
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.put('/usuario/:id',[verificaToken,verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    //retornar usuario actualizado pasar 3er argumento new:true
    //para correr validaciones colocar run validators true
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

})

app.delete('/usuario/:id',[verificaToken,verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado:false
    }
    Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true} ,(err, usuarioDesactivado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        };

        if(!usuarioDesactivado){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'No se pudo desactivar el usuario'
                }
            });
        };

        res.json({
            ok: true,
            usuario: usuarioDesactivado
        });
    });
})

module.exports = app
