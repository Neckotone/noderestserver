const express = require("express");
const { verificaToken } = require("../middleware/autenticacion");
const _ = require("underscore");
let app = express();

let Producto = require("../models/producto");

app.get("/productos", (req, res) => {
  //trae todos los productos
  //populate: usuario categoria
  //paginado
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite);
  Producto.find({ disponible: true })
    .skip(desde)
    .limit(limite)
    .populate("usuario", "nombre email")
    .populate("categoria", "nombre descripcion")
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      return res.json({
        productos: data
      });
    });
});

app.get("productos/:id", (req, res) => {
  //Producto por id
});

//Buscar productos
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
    let termino =  req.params.termino
    let regex = new RegExp(termino, 'i');
  Producto.find({nombre:regex})
    .populate("categoria", "nombre")
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      return res.json({
          ok: true,
          data
      })
    });
});

app.post("/productos", verificaToken, (req, res) => {
  //grabar el usuario
  //grabar una categoria del listado
  let reqProducto = req.body;
  let producto = new Producto({
    nombre: reqProducto.nombre,
    precioUni: reqProducto.precioUni,
    descripcion: reqProducto.descripcion,
    disponible: true,
    categoria: reqProducto.categoriaId,
    usuario: req.usuario._id
  });

  producto.save((err, data) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    res.status(201).json({
      ok: true,
      producto: data
    });
  });
});

app.put("/productos/:id", verificaToken, (req, res) => {
  //actualizar un producto
  let productoId = req.params.id;
  let body = _.pick(req.body, [
    "nombre",
    "descripcion",
    "precioUni",
    "categoria"
  ]);
  Producto.findByIdAndUpdate(
    productoId,
    body,
    { new: true, runValidators: true, context: "query" },
    (err, data) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      return res.status(200).json({
        ok: true,
        messaje: `Se actualizó el producto con el id ${data._id}`,
        producto: data
      });
    }
  );
});

app.delete("/productos/:id", verificaToken, (req, res) => {
  //borrar un producto
  let productoId = req.params.id;
  let body = _.pick(req.body, ["disponible"]);
  body.disponible = false;
  Producto.findOneAndUpdate(productoId, body, (err, data) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    return res.status(200).json({
      ok: true,
      messaje: "Se borro el producto con el Id" + data._id,
      producto: data
    });
  });
});

module.exports = app;
