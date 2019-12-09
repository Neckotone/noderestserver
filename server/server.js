const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./config/config')


app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());


//Configuracion global de rutas
app.use(require('./routes/index'));


mongoose.connect(process.env.urlDB,
{useNewUrlParser:true, useCreateIndex:true},    
(err, res)=>{
    if(err) throw err;
    console.log('Base de datos online')
});

app.listen(process.env.PORT, () => {
    console.log(`escuchando puerto ${process.env.PORT}`)
})