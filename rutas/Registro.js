const express = require('express');
const router = express.Router();
const conexion = require("../conexion");
const link = require("../config/link"); 

router.post('/Registro', function(req, res){
    let email = req.body.correo;
    let contraseña = req.body.contraseña;
    let nombre = req.body.nombre;
    let usuario = req.body.nombre_usuario;

    

    const consulta = "INSERT INTO usuarios (correo, contraseña, nombre, nombre_usuario) VALUES ('"+ email +"','"+ contraseña +"', '"+ nombre +"', '"+ usuario +"')";

    console.log("INSERT INTO usuarios (correo, contraseña, nombre, nombre_usuario) VALUES ('"+ email +"','"+ contraseña +"', '"+ nombre +"', '"+ usuario +"');");


    conexion.query(consulta, function(error, row){
        if(error){
            console.log("error al registrar");
            throw error;
        }
        else{
            console.log("registro exitos");
            res.render("inicio_de_secion", {link});
        }
    });

});

module.exports = router;
