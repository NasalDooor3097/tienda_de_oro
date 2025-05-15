import React from "react";
import "./Footer.css";
import instagram_icon from "../assets/instagram_icon.png";
import pintester_icon from "../assets/pintester_icon.png";
import whatsapp_icon from "../assets/whatsapp_icon.png";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-logo">
        <p>GoldenXpress</p>
      </div>
      <ul className="footer-links">
        <li>Compañia</li>
        <li>Productos</li>
        <li>Oficinas</li>
        <li>Sobre Nosotros</li>
        <li>Contacto</li>
      </ul>

      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <img src={instagram_icon} alt="Instagram" className="red-social" />
        </div>
        <div className="footer-icons-container">
          <img src={pintester_icon} alt="Pinterest" className="red-social" /> 
        </div>
        <div className="footer-icons-container">
          <img src={whatsapp_icon} alt="WhatsApp" className="red-social" />
        </div>
      </div>

      <div className="footer-copyright">
        <hr />
        <p>Todos los derechos reservados</p>
      </div>
    </div>
  );
}

export default Footer;
