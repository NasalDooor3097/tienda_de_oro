// SobreNosotros.jsx
import React from "react";
import "./SobreNosotros.css";

const SobreNosotros = () => {
   return (
    <div className="about-us-container">
      {/* Hero Banner */}
      <section className="hero-section">
        <h1>Conoce Nuestra Plataforma</h1>
        <p>Un marketplace global donde cualquiera puede vender y comprar productos únicos.</p>
      </section>

      {/* Sección "Quiénes Somos" */}
      <section className="section">
        <h2>Quiénes Somos</h2>
        <p>
          [Somos una plataforma fundada en 2024 con el objetivo de conectar a vendedores independientes con compradores de todo Mexico. Nuestra misión es democratizar el comercio electrónico."]
        </p>
      </section>

      {/* Sección "Cómo Funciona" */}
      <section className="section">
        <h2>Cómo Funciona</h2>
        <div className="steps-container">
          <div className="step">
            <h3>1. Regístrate</h3>
            <p>Los vendedores crean una cuenta y suben sus productos.</p>
          </div>
          <div className="step">
            <h3>2. Publica</h3>
            <p>Gestiona tu tienda con herramientas fáciles de usar.</p>
          </div>
          <div className="step">
            <h3>3. Vende</h3>
            <p>Llega a millones de compradores en nuestra plataforma.</p>
          </div>
        </div>
      </section>

      {/* Sección "Nuestros Valores" */}
      <section className="section">
        <h2>Nuestros Valores</h2>
        <ul className="values-list">
          <li>✔️ Transparencia en cada transacción.</li>
          <li>✔️ Soporte al emprendedor.</li>
          <li>✔️ Innovación constante.</li>
        </ul>
      </section>

 
    </div>
  );
};

export default SobreNosotros;
