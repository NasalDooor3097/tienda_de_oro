import React, { useState } from "react";
import "./PreguntasFrecuentes.css";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const PreguntasFrecuentes = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      pregunta: "¿Cómo me registro como vendedor?",
      respuesta:
        "Ve a 'perfil > Mis productos > vender producto ', completa el formulario y sube documentos. Verificación en 1-24h.",
    },
    {
      pregunta: "¿Qué comisiones cobran?",
      respuesta:
        "5% por venta + tarifa de pago. Ejemplo: venta de $100 = $94.50 para ti (5% + $0.50 procesamiento).",
    },
    {
      pregunta: "¿Cómo funcionan los envíos?",
      respuesta:
        "Puedes usar nuestro sistema logístico o gestionarlo tú mismo.",
    },
    {
      pregunta: "¿Puedo editar un producto ya publicado?",
      respuesta:
        "Sí, desde tu panel de vendedor. Los cambios se actualizan al instante.",
    },
    {
      pregunta: "¿Qué métodos de pago aceptan?",
      respuesta:
        "Tarjetas (Visa/MC/Amex), transferencias bancarias, y pagos en efectivo. Puedes elegir el método al finalizar la compra."
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
            WhatsApp +52 3326735624
          </button>
          <button className="contact-button email">
            GoldenXpress@gmail.com
          </button>
        </div>
      </section>
    </div>
  );
};

export default PreguntasFrecuentes;
