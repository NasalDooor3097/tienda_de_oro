import React, { useState } from "react";
import "./PreguntasFrecuentes.css";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const PreguntasFrecuentes = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      pregunta: "¿Cómo me registro como vendedor?",
      respuesta:
        "Ve a 'Registro > Vendedor', completa el formulario y sube documentos. Verificación en 24-48h.",
    },
    {
      pregunta: "¿Qué comisiones cobran?",
      respuesta:
        "5% por venta + tarifa de pago. Ejemplo: venta de $100 = $94.50 para ti (5% + $0.50 procesamiento).",
    },
    {
      pregunta: "¿Cómo funcionan los envíos?",
      respuesta:
        "Puedes usar nuestro sistema logístico o gestionarlo tú mismo. Los costos se calculan automáticamente.",
    },
    {
      pregunta: "¿Puedo editar un producto ya publicado?",
      respuesta:
        "Sí, desde tu panel de vendedor. Los cambios se actualizan en 15 minutos.",
    },
    {
      pregunta: "¿Qué métodos de pago aceptan?",
      respuesta:
        "Tarjetas (Visa/MC/Amex), PayPal, transferencias bancarias y criptomonedas seleccionadas.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <header className="faq-header">
        <h1>Preguntas Frecuentes</h1>
        <p className="faq-subtitle">Encuentra respuestas rápidas a tus dudas</p>
      </header>

      <main className="faq-main">
        {faqs.map((faq, index) => (
          <article
            key={index}
            className={`faq-card ${activeIndex === index ? "active" : ""}`}
            aria-expanded={activeIndex === index}
          >
            <button
              className="faq-question"
              onClick={() => toggleFAQ(index)}
              aria-controls={`faq-answer-${index}`}
            >
              <h2>{faq.pregunta}</h2>
              {activeIndex === index ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </button>

            <div
              id={`faq-answer-${index}`}
              className="faq-answer"
              hidden={activeIndex !== index}
            >
              <p>{faq.respuesta}</p>
            </div>
          </article>
        ))}
      </main>

      <section className="faq-contact">
        <h2>¿Necesitas más ayuda?</h2>
        <div className="contact-buttons">
          <button className="contact-button whatsapp">
            WhatsApp +1 234 567 890
          </button>
          <button className="contact-button email">
            soporte@tumarketplace.com
          </button>
        </div>
      </section>
    </div>
  );
};

export default PreguntasFrecuentes;
