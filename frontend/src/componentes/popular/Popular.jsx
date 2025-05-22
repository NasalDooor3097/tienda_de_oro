import "./Popular.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Item from "../Item/Item";

const BASE_URL = "http://localhost:4000";

const Popular = () => {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const categorias = useMemo(
    () => [
      "Ropa",
      "Zapatos",
      "Tecnología",
      "Joya y Oro",
      "Perfumes",
      "Juguetes",
    ],
    []
  );

  // Función para formatear la categoría para el endpoint
  const formatCategoryForEndpoint = useCallback((categoria) => {
    return categoria.replace(/ y /g, "Y").replace(/ /g, "");
  }, []);

  // Función para obtener productos (extraída para mejor organización)
  const fetchProductos = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      let endpoint = `${BASE_URL}/SearchAllProductShop`;

      if (categoriaSeleccionada !== "todas") {
        const categoriaEndpoint = formatCategoryForEndpoint(
          categoriaSeleccionada
        );
        endpoint = `${BASE_URL}/SearchAllProduct${categoriaEndpoint}`;
      }

      const response = await axios.post(endpoint, {});
      setProductos(response.data || []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setError(
        "No se pudieron cargar los productos. Intente nuevamente más tarde."
      );
      setProductos([]);
    } finally {
      setCargando(false);
    }
  }, [categoriaSeleccionada, formatCategoryForEndpoint]);

  // Efecto para cargar productos cuando cambia la categoría
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Filtrar productos por término de búsqueda (memoizado para evitar recálculos innecesarios)
  const productosFiltrados = useMemo(() => {
    if (!terminoBusqueda) return productos;

    const searchTerm = terminoBusqueda.toLowerCase();
    return productos.filter((item) =>
      item.titulo.toLowerCase().includes(searchTerm)
    );
  }, [terminoBusqueda, productos]);

  // Manejadores de eventos memoizados
  const handleCategoriaChange = useCallback((e) => {
    setCategoriaSeleccionada(e.target.value);
  }, []);

  const handleBusquedaChange = useCallback((e) => {
    setTerminoBusqueda(e.target.value);
  }, []);

  // Renderizado condicional para mensajes de estado
  const renderContent = () => {
    if (cargando) {
      return <div className="loading-spinner">Cargando productos...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (productosFiltrados.length === 0) {
      return (
        <div className="no-products">
          {terminoBusqueda
            ? `No se encontraron productos que coincidan con "${terminoBusqueda}"`
            : "Por el momento no hay productos disponibles"}
        </div>
      );
    }

    return (
      <div className="popular-item">
        {productosFiltrados.map((item, i) => (
          <Item
            key={`product-${item.id || i}`}
            id={item.id}
            name={item.titulo}
            image={`${BASE_URL}/${item.img1}`}
            new_price={item.new_price}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="popular">
      <h1>Productos</h1>
      <hr />

      <div className="popular-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={terminoBusqueda}
            onChange={handleBusquedaChange}
            className="search-input"
            aria-label="Buscar productos"
          />
        </div>

        <div className="category-filter">
          <select
            value={categoriaSeleccionada}
            onChange={handleCategoriaChange}
            className="category-select"
            aria-label="Filtrar por categoría"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default Popular;
