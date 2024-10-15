const express = require('express');
const router = express.Router();
const link = require("../config/link");



router.get("/", function(req, res){
    res.render("index", {link});
});

router.get("/productos.ejs", function(req, res){
    res.render("productos", {link});
});

router.get("/inicio_de_secion", function(req, res){
    res.render("inicio_de_secion", {link});
});

router.get("/paginasHTML/perfil.ejs", function(req, res){
    res.render("perfil", {link});
});
module.exports = router;