const mongoose = require('mongoose');
const uniqueVlidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema =  new Schema({
    nombre:{
        type: String,
        required : [true, 'El nombre de la categoria es necesario'],
        unique: true
    },

    descripcion:{
        type: String,
        required: false
    },

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },

    updatedBy:{
        type:  mongoose.Schema.Types.ObjectId,
        required: false,
        default: null
    }
})

categoriaSchema.plugin(uniqueVlidator, {message:'Ya existe una categoria llamada asi'});
module.exports = mongoose.model('Categoria',categoriaSchema);