import React, { useState } from "react";
import "./Contacto.css";
import { AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import Axios from "axios";

const Contacto = () => {
  // Variables de estado individuales
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);

  // Manejo de cambios
  const handleChangeNombre = (e) => setNombre(e.target.value);
  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangeTelefono = (e) => setTelefono(e.target.value);
  const handleChangeMensaje = (e) => setMensaje(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", { nombre, email, telefono, mensaje });
    setSubmitStatus("success");

    setTimeout(() => setSubmitStatus(null), 5000);

    // Resetear los valores
    setNombre("");
    setEmail("");
    setTelefono("");
    setMensaje("");
  };




  const enviarmensaje = () => {

    console.log("Si entra a la consulta ");
    Axios.post("http://localhost:4000/enviarmensaje", {
      nombre: nombre,
      email: email,
      telefono: telefono,
      mensaje: mensaje,
    })
      .then((response) => {
        console.log(response.data);
        setSubmitStatus("success");
      })
      .catch((error) => {
        console.error("Error al enviar el mensaje:", error);
        setSubmitStatus("error");
      });
  }



  return (
    <div className="contacto-container">
      <section className="contacto-hero">
        <h1>Contáctanos</h1>
        <p>¿Tienes dudas? Escríbenos y te responderemos en menos de 24 horas.</p>
      </section>

      <div className="contacto-content">
        <div className="contacto-info">
          <div className="info-card">
            <AiOutlineMail className="info-icon" />
            <h3>Correo Electrónico</h3>
            <p>goldenexpressexpressexpresa@gmail.com</p>
          </div>

          <div className="info-card">
            <AiOutlinePhone className="info-icon" />
            <h3>Teléfono</h3>
            <p>+52 3326735624</p>
          </div>

          <div className="info-card">
            <AiOutlineEnvironment className="info-icon" />
            <h3>Dirección</h3>
            <p>Av. Emiliano Zapata, Guadalajara</p>
          </div>
        </div>

        <form className="contacto-form" onSubmit={handleSubmit}>
          <h2>Envíanos un mensaje</h2>

          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input type="text" id="nombre" name="nombre" value={nombre} onChange={handleChangeNombre} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" name="email" value={email} onChange={handleChangeEmail} required />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input type="tel" id="telefono" name="telefono" value={telefono} onChange={handleChangeTelefono} />
          </div>

          <div className="form-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea id="mensaje" name="mensaje" rows="5" value={mensaje} onChange={handleChangeMensaje} required />
          </div>

          <button 
          onClick={() => enviarmensaje()}
           type="submit" className="submit-btn">Enviar Mensaje</button>

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