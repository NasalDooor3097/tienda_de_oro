import React, { useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import "./Navbar.css";
import logo from "../assets/golden_logo2.png";
import carrito from "../assets/carrito.png";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { FormContext } from "../../context/FormContext";
import Axios from "axios";
import {
  AiOutlineSetting,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineDown,
  AiOutlineUp,
  AiOutlineHome,
  AiOutlineQuestionCircle,
  AiOutlineInfoCircle,
  AiOutlinePhone,
  AiOutlineFileText,
} from "react-icons/ai";

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { getTotalCartItems } = useContext(ShopContext);
  const { userlist, logout } = useContext(FormContext);
  const navigate = useNavigate();
  const [Adminstate, SetAdminstate] = useState("");

  useEffect(() => {
    if (!Array.isArray(userlist)) {
      console.error("userlist is not an array:", userlist);
      return;
    }

    let nombre, correo, password;

    userlist.forEach((user) => {
      nombre = user.user_name;
      correo = user.email;
      password = user.password;
    });

    if (nombre && correo && password) {
      Axios.post("http://localhost:4000/SearchAdmin", {
        nombre,
        correo,
        password,
      }).then((response) => {
        if (response.data.length > 0) {
          SetAdminstate("verdadero");
        } else {
          SetAdminstate("falso");
        }
      });
    }
  }, [userlist]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    SetAdminstate("falso");
    navigate("/login");
  };

  const confirmLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se cerrará tu sesión.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
        Swal.fire(
          "¡Sesión cerrada!",
          "Tu sesión ha sido cerrada con éxito.",
          "success"
        );
      }
    });
  };

  const handleNavLinkClick = () => {
    if (isActive) setIsActive(false);
  };

  const isAdmin = Adminstate === "verdadero";
  const isLoggedIn =
    Array.isArray(userlist) &&
    userlist.length > 0 &&
    userlist.some((user) => user.user_name && user.user_name.trim() !== "");

  return (
    <nav className={`navbar ${isActive ? "active" : ""}`}>
      <ul className="navegacion">
        <div className="left">
          <div className="logo">
            <Link to="/" onClick={handleNavLinkClick}>
              <img
                id="logo-img"
                className="golden_lineal"
                src={logo}
                alt="Logo"
              />
            </Link>
          </div>
        </div>

        <div className="center">
          {isAdmin && (
            <Link to="/admin" onClick={handleNavLinkClick}>
              <AiOutlineSetting /> Administración
            </Link>
          )}
          {isLoggedIn ? (
            <li>
              <Link to="/perfil" onClick={handleNavLinkClick}>
                <AiOutlineUser /> Perfil
              </Link>
            </li>
          ) : (
            <li></li>
          )}{" "}
          {!isAdmin && (
            <li>
              <Link
                className="text-products"
                to="/"
                onClick={handleNavLinkClick}
              >
                <AiOutlineHome /> Productos
              </Link>
            </li>
          )}
          {!isAdmin && (
            <li className="dropdown-container">
              <div className="dropdown-trigger" onClick={toggleDropdown}>
                <span className="text-products">Más información</span>
                {dropdownOpen ? <AiOutlineUp /> : <AiOutlineDown />}
              </div>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link
                      className="text-products"
                      to="/Blog"
                      onClick={handleNavLinkClick}
                    >
                      <AiOutlineFileText /> Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-products"
                      to="/SobreNosotros"
                      onClick={handleNavLinkClick}
                    >
                      <AiOutlineInfoCircle /> Sobre Nosotros
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-products"
                      to="/preguntas-frecuentes"
                      onClick={handleNavLinkClick}
                    >
                      <AiOutlineQuestionCircle /> Preguntas Frecuentes
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-products"
                      to="/Contacto"
                      onClick={handleNavLinkClick}
                    >
                      <AiOutlinePhone /> Contacto
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          )}
        </div>

        <div className="right">
          {isLoggedIn ? (
            <>
              <button
                onClick={confirmLogout}
                className="button-principal-2 flex-align"
              >
                <span className="color-w flex-align">Cerrar sesión</span>
              </button>
              {!isAdmin && (
                <Link to="/cart" onClick={handleNavLinkClick}>
                  <button className="carrito-logo" style={{ border: "none" }}>
                    <img id="carrito-logo" src={carrito} alt="Carrito" />
                    <div className="nav-cart-cont">{getTotalCartItems()}</div>
                  </button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" onClick={handleNavLinkClick}>
                <button className="button-principal-2 flex-align">
                  <span className="color-w flex-align">Ingresar</span>
                </button>
              </Link>
              <Link to="/register" onClick={handleNavLinkClick}>
                <button className="button-principal-2 flex-align">
                  <span className="color-w flex-align">Registrarme</span>
                </button>
              </Link>
            </>
          )}
        </div>
      </ul>

      <div className="menu-toggle" onClick={handleToggle}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
