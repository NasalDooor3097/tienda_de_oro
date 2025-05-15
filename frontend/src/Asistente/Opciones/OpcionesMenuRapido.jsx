import React from "react";
import "./OpcionesMenuRapido.css";

const OpcionesMenuRapido = (props) => {
  const options = [
    {
      text: "Ver catálogo",
      handler: () => {
        // Acción para ver el catálogo
        props.actionProvider.mostrarCatalogo();
      },
      id: 1,
    },
    {
      text: "Soy vendedor",
      handler: () => {
        // Acción para registrarse como vendedor
        props.actionProvider.mostrarRegistroVendedor();
      },
      id: 2,
    },
    {
      text: "Preguntas frecuentes",
      handler: () => {
        // Acción para mostrar preguntas frecuentes
        props.actionProvider.mostrarFAQ();
      },
      id: 3,
    },
  ];

  return (
    <div className="opciones-menu-rapido">
      {options.map((option) => (
        <button key={option.id} className="opcion-btn" onClick={option.handler}>
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default OpcionesMenuRapido;
