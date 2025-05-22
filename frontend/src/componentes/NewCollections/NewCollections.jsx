// Tecnologia.jsx - Componente simplificado
import React from "react";
import "./NewCollections.css"; // Nota: mantiene la importación original
import ProductCarousel from "../productCarousel/productCarousel";

const Tecnologia = () => {
  // Si necesitas alguna configuración específica para tecnología, agrégala aquí
  const settings = {
    // Aquí puedes personalizar cualquier configuración si es necesario
  };

  return (
    <ProductCarousel
      title="Tecnología"
      endpoint="SearchAllProductTechnology"
      containerClass="tecnologia-container"
      titleClass="tecnologia-title"
      dividerClass="tecnologia-divider"
      carouselClass="tecnologia-carousel"
      itemClass="tecnologia-carousel-item"
      settings={settings}
    />
  );
};

export default Tecnologia;
