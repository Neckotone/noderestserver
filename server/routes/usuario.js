const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore'); //para seleccionar claves de objetos

app.get('/usuario', (req, res) => {
    res.json('get usuario');
})

app.post('/usuario', (req, res) => {
    let persona = req.body;
    let usuario = new Usuario({
        nombre: persona.nombre,
        email: persona.email,
        password: bcrypt.hashSync(persona.password, 10),
        role: persona.role
    })

    usuario.save((err, usuarioDB)=>{
        if(err){
           return res.status(400).json({
                ok:false,
                err
            })
        }
        
        //usuarioDB.password = null
        res.json({
            ok:true,
            usuario:usuarioDB
        })
    })
})

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body,['nombre','email','img','role','estado']);
    


    //retornar usuario actualizado pasar 3er argumento new:true
    //para correr validaciones colocar run validators true
    Usuario.findByIdAndUpdate(id, body,{new:true, runValidators:true}, (err, usuarioDB) =>{
        if(err){
            return res.status(400).json({
                 ok:false,
                 err
             })
         }
         
        res.json({
            ok:true,
            usuario:usuarioDB
        });
    })

})

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
})

module.exports = app
