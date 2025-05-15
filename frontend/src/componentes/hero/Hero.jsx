import React from "react";
import "./Hero.css";
import hand_icon from "../assets/oro.png";
import arrow_icon from "../assets/arrow.png";
import hero_image from "../assets/hero_image.avif";

const Hero = () => {
  return (
    <div className="hero">
      {/* Sección de texto a la izquierda */}
      <div className="hero-left">
        <h2>Marketplace Mexicano</h2>
        <div className="hero-description">
          {/* Icono de mano y nuevo */}
          <div className="hand-hand-icon">
            <p className="hero-new">Destacado</p>
            <img id="Img-oro" src={hand_icon} alt="Icono de oro" />
          </div>
          <p className="hero-collections">Tecnología • Artesanías • Oro</p>
          <p className="hero-for-everyone">Para compradores y vendedores</p>
        </div>

        {/* Botón para ir a la última colección */}
        <div className="hero-latest-btn">
          <div>Explorar Productos</div>
          <img src={arrow_icon} alt="Flecha para ver más" />
        </div>
      </div>

      {/* Imagen de la colección a la derecha */}
      <div className="hero-right">
        <div className="hero-collection-title"></div>
        <img id="img-oro" src={hero_image} alt="Productos mexicanos" />
      </div>
    </div>
  );
};

export default Hero;
