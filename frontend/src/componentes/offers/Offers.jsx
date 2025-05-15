import React from "react";
import "./Offers.css";
import exclusive_image from "../assets/offers.jpg";

const Offers = () => {
  return (
    <div className="offers-container">
      <div className="offers">
        <div className="offers-content">
          <h1>¡Grandes Ofertas de Vendedores Mexicanos!</h1>
          <h2>Descubre lo mejor en tecnología, artesanías y joyería</h2>

          <div className="offer-features">
            <div className="feature">
              <span className="icon fire">🔥</span>
              <span>Tecnología con garantía</span>
            </div>
            <div className="feature">
              <span className="icon hand">🖐️</span>
              <span>Artesanías auténticas</span>
            </div>
            <div className="feature">
              <span className="icon diamond">💎</span>
              <span>Oro certificado</span>
            </div>
          </div>

          <div className="offer-actions">
            <button className="primary-btn">Explorar Productos</button>
            <a href="/registro-vendedor" className="secondary-link">
              ¿Eres vendedor?
            </a>
          </div>
        </div>

        <div className="offer-image-container">
          <img src={exclusive_image} alt="Ofertas especiales" />
        </div>
      </div>
    </div>
  );
};

export default Offers;
