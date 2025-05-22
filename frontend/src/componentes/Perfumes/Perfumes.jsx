// Perfumes.jsx - Componente simplificado
import React from "react";
import "./Perfumes.css";
import ProductCarousel from "../productCarousel/productCarousel";

const Perfumes = () => {
  // Configuración específica para perfumes
  const settings = {
    speed: 600, // Velocidad de transición personalizada para perfumes
  };

  return (
    <ProductCarousel
      title="Perfumes"
      endpoint="SearchAllProductPerfumes"
      containerClass="perfumes-container"
      titleClass="perfumes-title"
      dividerClass="perfumes-divider"
      carouselClass="perfumes-carousel"
      itemClass="perfume-carousel-item"
      settings={settings}
    />
  );
};

export default Perfumes;
