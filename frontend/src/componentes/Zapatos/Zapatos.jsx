import React from "react";
import "./Zapatos.css";
import ProductCarousel from "../productCarousel/productCarousel";

const Zapatos = () => {
  // Configuración específica para zapatos (en este caso es la configuración estándar)
  // Puedes personalizarla si necesitas algo específico para zapatos
  const settings = {
    // Si quieres personalizar algo específico, hazlo aquí
  };

  return (
    <ProductCarousel
      title="Zapatos"
      endpoint="SearchAllProductZapatos"
      containerClass="zapatos-container"
      titleClass="zapatos-title"
      dividerClass="zapatos-divider"
      carouselClass="zapatos-carousel"
      itemClass="zapato-carousel-item" // Mantiene el singular "zapato-carousel-item" como en el original
      settings={settings}
    />
  );
};

export default Zapatos;
