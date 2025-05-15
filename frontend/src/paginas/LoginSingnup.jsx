import React, { useContext } from "react";
import "./CSS/LoginSignup.css";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import { FormContext } from "../context/FormContext";
import logoGold from "./CSS/img/logo-gold.jpg";

const LoginSingnup = () => {
  const {
    nombre,
    setNombre,
    correo,
    setCorreo,
    password,
    setPassword,
    setUser,
  } = useContext(FormContext);
  const navigate = useNavigate();

  const search = () => {
    if (!nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Falta información",
        text: "Por favor, ingresa tu nombre.",
      });
      return;
    }

    if (!correo.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Falta información",
        text: "Por favor, ingresa tu correo.",
      });
      return;
    }

 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor, ingresa un correo válido.",
      });
      return;
    }

    if (!password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Falta información",
        text: "Por favor, ingresa tu contraseña.",
      });
      return;
    }

    Axios.post("http://localhost:4000/search", {
      nombre: nombre,
      correo: correo,
      password: password,
    })
      .then((response) => {
        setUser(response.data);
        if (response.data.length > 0) {
          Swal.fire({
            icon: "success",
            title: "¡Inicio de sesión exitoso!",
            text: "Se ha iniciado sesión con éxito.",
          }).then(() => {
            navigate("/");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Credenciales incorrectas",
            text: "Por favor, inténtalo de nuevo.",
          });
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        Swal.fire({
          icon: "error",
          title: "Error del servidor",
          text: "Hubo un error al intentar iniciar sesión. Por favor, inténtalo más tarde.",
        });
      });
  };
  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1></h1>
        <img className="loginsignup-logo" src={logoGold} alt="Logo" />

        <div className="loginsignup-field">
          <Link to={"/LogAdmin"}>
            <button style={{ width: "40%" }}>Entrar como Aministrador</button>
          </Link>

          <input
            onChange={(event) => {
              setNombre(event.target.value);
            }}
            type="text"
            placeholder="Tu nombre"
          />
          <input
            onChange={(event) => {
              setCorreo(event.target.value);
            }}
            type="email"
            placeholder="Tu correo"
          />
          <input
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            type="password"
            placeholder="Tu contraseña"
          />
          <button onClick={search}>Iniciar sesion</button>
        </div>

        <p className="loginsignup-login">
          No tienes cuenta?{" "}
          <Link to="/register">
            {" "}
            <span>Registrate aqui 👌</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginSingnup;
