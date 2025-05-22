// ProductCarousel.jsx - Componente genérico reutilizable
import React, { useEffect, useState, memo } from "react";
import Axios from "axios";
import Item from "../Item/Item";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./productCarousel.css"; // Crear un archivo CSS común

const ProductCarousel = memo(
  ({
    title,
    endpoint,
    containerClass,
    titleClass,
    dividerClass,
    carouselClass,
    itemClass,
    settings: customSettings = {},
  }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Configuración base del carrusel
    const defaultSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      pauseOnHover: true,
      arrows: true,
      lazyLoad: "ondemand",
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            arrows: false,
          },
        },
      ],
    };

    // Combinar configuraciones
    const settings = { ...defaultSettings, ...customSettings };

    useEffect(() => {
      let mounted = true;
      setLoading(true);

      const fetchData = async () => {
        try {
          const response = await Axios.post(
            `http://localhost:4000/${endpoint}`,
            {}
          );
          if (mounted) {
            setProducts(response.data?.length > 0 ? response.data : []);
            setLoading(false);
          }
        } catch (error) {
          if (mounted) {
            console.error(`Error al cargar productos de ${endpoint}:`, error);
            setProducts([]);
            setLoading(false);
          }
        }
      };

      fetchData();

      // Cleanup function
      return () => {
        mounted = false;
      };
    }, [endpoint]);

    return (
      <div className={containerClass || "product-carousel-container"}>
        <h1 className={titleClass || "product-carousel-title"}>{title}</h1>
        <hr className={dividerClass || "product-carousel-divider"} />

        <div className="product-carousel-wrapper">
          {loading ? (
            <div className="loading-container">Cargando productos...</div>
          ) : products.length > 0 ? (
            <Slider
              {...settings}
              className={carouselClass || "product-carousel"}
            >
              {products.map((item, i) => (
                <div key={i} className={itemClass || "carousel-item"}>
                  <Item
                    id={item.id}
                    name={item.titulo}
                    image={`http://localhost:4000/${item.img1}`}
                    new_price={item.new_price}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p className="no-products">Por el momento no hay productos</p>
          )}
        </div>
      </div>
    );
  }
);

export default ProductCarousel;
