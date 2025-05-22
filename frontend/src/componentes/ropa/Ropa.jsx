// Ropa.jsx - Componente simplificado
import React from "react";
import "./Ropa.css";
import ProductCarousel from "../productCarousel/productCarousel";

const Ropa = () => {
  // Si necesitas alguna configuración específica para ropa, agrégala aquí
  // De lo contrario, se usará la configuración predeterminada
  const settings = {
    // Puedes personalizar cualquier configuración si es necesario
    // Por ejemplo:
    // autoplaySpeed: 3200,
  };

  return (
    <ProductCarousel
      title="Ropa"
      endpoint="SearchAllProductRopa"
      containerClass="ropa-container"
      titleClass="ropa-title"
      dividerClass="ropa-divider"
      carouselClass="ropa-carousel"
      itemClass="ropa-carousel-item"
      settings={settings}
    />
  );
};

export default Ropa;
