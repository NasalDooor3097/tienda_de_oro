import React from "react";
import "./NewsLetter.css";

const NewsLetter = () => {
  return (
    <div className="newsletter">
      <h1>Regístrate y consigue ofertas exclusivas</h1>
      <p>Suscríbete</p>
      <div className="newsletter-input-container">
        <input type="email" placeholder="Ingresa tu correo" />
        <button>¡Vamos 😊👌!</button>
      </div>
    </div>
  );
}

export default NewsLetter;
