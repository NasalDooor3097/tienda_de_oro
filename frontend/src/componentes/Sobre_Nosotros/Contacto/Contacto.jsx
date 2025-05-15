import React, { useState } from "react";
import "./Contacto.css";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEnvironment,
} from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario (API, email, etc.)
    console.log("Datos enviados:", formData);
    setSubmitStatus("success");
    setTimeout(() => setSubmitStatus(null), 5000);
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      mensaje: "",
    });
  };

  return (
    <div className="contacto-container">
      <section className="contacto-hero">
        <h1>Contáctanos</h1>
        <p>
          ¿Tienes dudas? Escríbenos y te responderemos en menos de 24 horas.
        </p>
      </section>

      <div className="contacto-content">
        <div className="contacto-info">
          <div className="info-card">
            <AiOutlineMail className="info-icon" />
            <h3>Correo Electrónico</h3>
            <p>soporte@tumarketplace.com</p>
          </div>

          <div className="info-card">
            <AiOutlinePhone className="info-icon" />
            <h3>Teléfono</h3>
            <p>+1 (555) 123-4567</p>
          </div>

          <div className="info-card">
            <AiOutlineEnvironment className="info-icon" />
            <h3>Dirección</h3>
            <p>Av. Marketplace 123, Ciudad Digital</p>
          </div>
        </div>

        <form className="contacto-form" onSubmit={handleSubmit}>
          <h2>Envíanos un mensaje</h2>

          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="5"
              value={formData.mensaje}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Enviar Mensaje
          </button>

          {submitStatus === "success" && (
            <div className="success-message">
              <BsCheckCircle /> ¡Mensaje enviado con éxito!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contacto;
