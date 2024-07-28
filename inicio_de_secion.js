function ventana_recuperar_password()
{

    var correo = window.prompt("Ingresa tu correo");

    if (correo != null)
    {
        var key = window.prompt("Ingresa los digitos que se enviaron al correo");
    }

}

function validar_datos_del_login()
{

    const inputcorreo = document.getElementById("correo");
    const inputcontraseña = document.getElementById("contraseña");

    const correo = inputcorreo.value;
    const contraseña = inputcontraseña.value;

    console.log(correo, contraseña);
    
}