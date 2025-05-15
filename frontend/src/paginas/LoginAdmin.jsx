import React, { useContext } from "react";
import "./CSS/LoginSignup.css";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { FormContext } from "../context/FormContext";
import logoGold from "./CSS/img/admin.jpg";

const LoginAdmin = () => {
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
    Axios.post("http://localhost:4000/SearchAdmin", {
      nombre: nombre,
      correo: correo,
      password: password,
    }).then((response) => {
      setUser(response.data);
      console.log(setUser);
      if (response.data.length > 0) {
        navigate("/admin");
      } else {
        alert("No se encontro el Admin");
      }
    });
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1></h1>
        <img className="loginsignup-logo" src={logoGold} alt="Logo" />

        <div className="loginsignup-field">
          <Link to={"/login"}>
            <button style={{ width: "40%" }}>Regresar</button>
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
          <button onClick={search}>Continuar como admin</button>
        </div>

        <p className="loginsignup-login"></p>
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>
            Para continuar, estoy deacuerdo con los terminos de uso y politicas
            de privacidad
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
