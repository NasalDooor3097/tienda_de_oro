import React, { useState } from "react";
import "./OpcionesIniciales.css";

const OpcionesIniciales = (props) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = [
    {
      title: "📌 Sobre el sitio",
      options: [
        {
          text: "¿Qué es este sitio?",
          handler: props.actionProvider.mostrarInfoSitio,
          id: 1,
        },
        {
          text: "¿Cómo funciona?",
          handler: props.actionProvider.mostrarFuncionVenta,
          id: 2,
        },
      ],
    },
    {
      title: "🛍️ Vender productos",
      options: [
        {
          text: "Quiero vender",
          handler: props.actionProvider.mostrarRegistroVendedor,
          id: 3,
        },
        {
          text: "Subir mis productos",
          handler: props.actionProvider.mostrarSubirProductos,
          id: 4,
        },
      ],
    },
    {
      title: "📦 Productos",
      options: [
        {
          text: "¿Qué productos puedo vender?",
          handler: props.actionProvider.mostrarProductosComida,
          id: 5,
        },
  
      ],
    },
    {
      title: "💳 Pagos y envíos",
      options: [
        {
          text: "Formas de pago",
          handler: props.actionProvider.mostrarFormasPago,
          id: 7,
        },
        {
          text: "Envíos internacionales",
          handler: props.actionProvider.mostrarEnviosInternacionales,
          id: 8,
        },
      ],
    },
    {
      title: "🛟 Ayuda",
      options: [
        {
          text: "Contactar con agente",
          handler: props.actionProvider.redirigirContacto,
          id: 9,
        },
      ],
    },
  ];

  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  return (
    <div className="opciones-widget">
      {categories.map((category, index) => (
        <div key={index} className="category-group">
          <button
            className="category-title"
            onClick={() => toggleCategory(index)}
          >
            {category.title} {expandedCategory === index ? "▼" : "►"}
          </button>
          {expandedCategory === index && (
            <div className="options-container">
              {category.options.map((option) => (
                <button
                  key={option.id}
                  className="opcion-btn"
                  onClick={option.handler}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OpcionesIniciales;
