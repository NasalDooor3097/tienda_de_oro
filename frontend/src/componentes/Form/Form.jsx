import React, { useState } from "react";
import "./Form.css";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const Form = () => {
    const [nombre, SetNombre] = useState("");
    const [correo, SetCorreo] = useState("");
    const [password, SetPassword] = useState("");
    const navigate = useNavigate();

    const add = () => {
        if (!nombre || !correo || !password) {
            MySwal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Se deben completar todos los campos",
            });
        } else {
            Axios.post("http://localhost:4000/Valid", {
                nombre: nombre,
                correo: correo,
            }).then((res) => {
                if (res.data === "fallo") {
                    MySwal.fire({
                        icon: "error",
                        title: "Usuario ya registrado",
                        text: "El usuario o el correo ya están registrados",
                    });
                } else {
                    const longitudMinima = /.{6,}/;
                    const mayuscula = /[A-Z]/;
                    const minuscula = /[a-z]/;
                    const numero = /\d/;
                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    if (!regex.test(correo)) {
                        MySwal.fire({
                            icon: "error",
                            title: "Correo inválido",
                            text: "El correo debe contener al menos un '@' y un dominio válido",
                        });
                    } else if (!longitudMinima.test(password)) {
                        MySwal.fire({
                            icon: "info",
                            title: "Contraseña corta",
                            text: "La contraseña debe tener al menos 6 caracteres",
                        });
                    } else if (!mayuscula.test(password)) {
                        MySwal.fire({
                            icon: "info",
                            title: "Contraseña sin mayúsculas",
                            text: "La contraseña debe contener al menos una letra mayúscula",
                        });
                    } else if (!numero.test(password)) {
                        MySwal.fire({
                            icon: "info",
                            title: "Contraseña sin números",
                            text: "La contraseña debe contener al menos un número",
                        });
                    } else if (!minuscula.test(password)) {
                        MySwal.fire({
                            icon: "info",
                            title: "Contraseña sin minúsculas",
                            text: "La contraseña debe contener al menos una letra minúscula",
                        });
                    } else if (nombre.length > 20 || nombre.length < 4) {
                        MySwal.fire({
                            icon: "info",
                            title: "Nombre inválido",
                            text: "El nombre debe tener entre 4 y 20 caracteres",
                        });
                    } else {
                        Axios.post("http://localhost:4000/create", {
                            nombre: nombre,
                            correo: correo,
                            password: password,
                        }).then((respuesta) => {
                            if (respuesta.data === "fallo") {
                                MySwal.fire({
                                    icon: "error",
                                    title: "Registro fallido",
                                    text: "Ocurrió un error al registrar el usuario.",
                                });
                            } else {
                                MySwal.fire({
                                    icon: "success",
                                    title: "Registro exitoso",
                                    text: "El usuario fue registrado correctamente.",
                                }).then(() => {
                                    navigate("/login"); 
                                });
                            }
                        });
                    }
                }
            });
        }
    };

    return (
        <div className="Registercontainer">
            <div className="Form">
                <h2>Ingresa tus datos</h2>
                <input
                    onChange={(event) => SetNombre(event.target.value)}
                    type="text"
                    placeholder="Tu nombre de usuario"
                    required
                />
                <input
                    onChange={(event) => SetCorreo(event.target.value)}
                    type="email"
                    placeholder="Tu correo"
                    required
                />
                <input
                    onChange={(event) => SetPassword(event.target.value)}
                    type="password"
                    placeholder="Tu contraseña"
                    required
                />
                <button onClick={add}>Registrarme</button>
            </div>
        </div>
    );
};

export default Form;