
// Juguetes.jsx - Componente simplificado
import React from "react";
import "./Juguetes.css";
import ProductCarousel from "../productCarousel/productCarousel";

const Juguetes = () => {
  // Configuración específica para juguetes
  const settings = {
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <ProductCarousel
      title="Juguetes"
      endpoint="SearchAllProductJuguetes"
      containerClass="juguetes-container"
      titleClass="juguetes-title"
      dividerClass="juguetes-divider"
      carouselClass="juguetes-carousel"
      itemClass="juguete-carousel-item"
      settings={settings}
    />
  );
};

export default Juguetes;