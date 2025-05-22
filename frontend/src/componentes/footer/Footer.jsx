import React from "react";
import { Link } from "react-router-dom";
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
        <li>
          <Link to="/blog">
            <button className="footer-button">Compañia</button>
          </Link>
        </li>
        <li>
          <Link to="/">
            <button className="footer-button">Productos</button>
          </Link>
        </li>
        <li>
          <Link to="/preguntas-frecuentes">
            <button className="footer-button">Oficinas</button>
          </Link>
        </li>
        <li>
          <Link to="/SobreNosotros">
            <button className="footer-button">Sobre Nosotros</button>
          </Link>
        </li>
        <li>
          <Link to="/contacto">
            <button className="footer-button">Contacto</button>
          </Link>
        </li>
      </ul>

      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instagram_icon} alt="Instagram" className="red-social" />
          </a>
        </div>
        <div className="footer-icons-container">
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={pintester_icon} alt="Pinterest" className="red-social" />
          </a>
        </div>
        <div className="footer-icons-container">
          <a
            href="https://wa.me/numero"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={whatsapp_icon} alt="WhatsApp" className="red-social" />
          </a>
        </div>
      </div>

      <div className="footer-copyright">
        <hr />
        <p>Todos los derechos reservados</p>
      </div>
    </div>
  );
};

export default Footer;
