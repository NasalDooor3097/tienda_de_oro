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
                <h2>Oro Exquisito</h2>
                <div className="hero-description">
                    {/* Icono de mano y nuevo */}
                    <div className="hand-hand-icon">
                        <p className="hero-new">Nuevo</p>
                        <img id="Img-oro" src={hand_icon} alt="Icono de mano" />
                    </div>
                    <p className="hero-collections">Joyas Exclusivas</p>
                    <p className="hero-for-everyone">Para Todos</p>
                </div>

                {/* Botón para ir a la última colección */}
                <div className="hero-latest-btn">
                    <div>Última Colección</div>
                    <img src={arrow_icon} alt="Flecha para ver más" />
                </div>
            </div>

            {/* Imagen de la colección a la derecha */}
            <div className="hero-right">
                <div className="hero-collection-title"></div>
                <img id="img-oro" src={hero_image} alt="Joyería de oro" />
            </div>
        </div>
    );
};

export default Hero;
