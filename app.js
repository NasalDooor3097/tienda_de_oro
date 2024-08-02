//librerias
const exrepess = require("express");
const app = exrepess();


//configuracion
app.set("view engine", "ejs");
app.use(exrepess.json());
app.use(exrepess.urlencoded({extended:false}));


//rutas
app.use(require("./rutas/index"))
app.use(exrepess.static("public"));
app.use(require("./rutas/Registro"));

// servidor 
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    if(PORT == 3000){
        console.log(`Servidor en http://localhost:3000`);
    }
    else{
        console.log("valio mais :(");
    }
});




