const express = require("express");
let app = express();
const _ = require("underscore");

let {
  verificaToken,
  verificaAdmin_Role
} = require("../middleware/autenticacion");
let Categoria = require("../models/categoria");

//muestra todas las categoriaas
app.get("/categoria", (req, res) => {
  Categoria.find({})
  .sort('nombre')
    .populate("createdBy", "nombre email")
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      return res.json({
        categorias: data
      });
    });
});

//mostrar una categoria por ID
app.get("/categoria/:id", (req, res) => {
  let categoriaId = req.params.id;
  Categoria.findById(categoriaId, (err, data) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.json({
      categoria: data
    });
  });
});

app.post("/categoria", verificaToken, (req, res) => {
  //regresa la nueva categoria
  //req.usuario._id

  let reqCategory = req.body;
  let categoria = new Categoria({
    nombre: reqCategory.nombre,
    descripcion: reqCategory.descripcion,
    createdBy: req.usuario._id
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    //usuarioDB.password = null
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

app.put("/categoria/:id", verificaToken, (req, res) => {
  let categoriaId = req.params.id;
  let body = _.pick(req.body, ["nombre", "descripcion"]);
  body.updatedBy = req.usuario._id;
  console.log(categoriaId);
  Categoria.findByIdAndUpdate(
    categoriaId,
    body,
    { new: true, runValidators: true, context: "query" },
    (err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        categoria: data
      });
    }
  );
});

app.delete(
  "/categoria/:id",
  [verificaToken, verificaAdmin_Role],
  (req, res) => {
    //solo un administrador puede borrar categorias
    //Categoria.findByIdAndRemove
    let categoriaId = req.params.id;
    Categoria.findByIdAndDelete(categoriaId, (err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        categoria: data
      });
    });
  }
);

module.exports = app;
