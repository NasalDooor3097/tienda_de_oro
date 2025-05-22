// Joyas.jsx - Componente simplificado
import React from "react";
import "./Joyas.css";
import ProductCarousel from "../productCarousel/productCarousel";

const Joyas = () => {
  // Configuración específica para joyas
  const settings = {
    autoplaySpeed: 3500, // Un poco más lento para apreciar mejor los detalles de las joyas
  };

  return (
    <ProductCarousel
      title="Joyas y Oro"
      endpoint="SearchAllProductJoyas"
      containerClass="joyas-container"
      titleClass="joyas-title"
      dividerClass="joyas-divider"
      carouselClass="joyas-carousel"
      itemClass="joyas-carousel-item"
      settings={settings}
    />
  );
};

export default Joyas;
