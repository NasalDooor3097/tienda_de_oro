const mysql = require('mysql');

const conexion = mysql.createConnection({ 
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: '24_kilates',
});

conexion.connect( function(error){ 
    
    if (error) throw error; 
    console.log('Conexión exitosa a la base de datos'); 
});

module.exports = conexion;