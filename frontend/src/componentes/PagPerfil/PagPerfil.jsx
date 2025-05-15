import React, { useContext, useState, useEffect } from "react";
import "./PagPerfil.css";
import { FormContext } from "../../context/FormContext";
import Axios from "axios";
import Item from "../Item/Item";
import { Link } from "react-router-dom";
import { AiFillShopping } from "react-icons/ai";
import { PaymentIcon } from "react-svg-credit-card-payment-icons";
import {
  FaHandSparkles,
  FaEnvelope,
  FaUser,
  FaUpload,
  FaCog,
  FaBox,
  FaBoxOpen,
  FaHistory,
} from "react-icons/fa";
import Swal from "sweetalert2";

const PagPerfil = () => {
  const { userlist } = useContext(FormContext);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [id_user, setIdUser] = useState("");
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [todosLosPedidos, setTodosLosPedidos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState("perfil");

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (userlist.length > 0) {
      const user = userlist[0];
      setNombre(user.user_name);
      setCorreo(user.email);
      setIdUser(user.id);

      Axios.post("http://localhost:4000/SearchAdmin", {
        nombre: user.user_name,
        correo: user.email,
        password: user.password,
      })
        .then((response) => {
          if (response.data.length > 0) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        })
        .catch((error) => {
          console.error("Error al verificar administrador:", error);
        });
    }
  }, [userlist]);

  // Función para eliminar un producto
  const EliminarProducto = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.post("http://localhost:4000/EliminarProducto", { id: id })
          .then((response) => {
            Swal.fire(
              "¡Eliminado!",
              "El producto se eliminó exitosamente.",
              "success"
            );
            setProductos((prevProductos) =>
              prevProductos.filter((producto) => producto.id !== id)
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              "No se pudo eliminar el producto. Intenta de nuevo.",
              "error"
            );
            console.error("Error al eliminar el producto:", error);
          });
      }
    });
  };

  // Función para cancelar un pedido
  const CancelarPedido = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, mantenerlo",
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.post("http://localhost:4000/EliminarPedido", { id: id })
          .then((response) => {
            Swal.fire(
              "¡Cancelado!",
              "El pedido se canceló exitosamente.",
              "success"
            );
            setPedidos((prevPedidos) =>
              prevPedidos.filter((pedido) => pedido.id !== id)
            );
            setTodosLosPedidos((prevPedidos) =>
              prevPedidos.filter((pedido) => pedido.id !== id)
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              "No se pudo cancelar el pedido. Intenta de nuevo.",
              "error"
            );
            console.error("Error al cancelar el pedido:", error);
          });
      }
    });
  };

  // Función para obtener todos los pedidos del usuario
  const ObtenerTodosLosPedidos = (id_user) => {
    Axios.post("http://localhost:4000/SearchOrder", { id_user: id_user })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setTodosLosPedidos(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setTodosLosPedidos([]);
        }
      })
      .catch((error) => {
        console.error("No se pudieron obtener los pedidos, error: ", error);
        setTodosLosPedidos([]);
      });
  };

  useEffect(() => {
    if (userlist.length > 0 && !isAdmin) {
      const user = userlist[0];
      setNombre(user.user_name);
      setCorreo(user.email);
      setIdUser(user.id);

      // Obtener los productos del usuario
      Axios.post("http://localhost:4000/SearchProduct", { id_user: user.id })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setProductos(response.data);
          } else {
            console.error("Expected an array but got:", response.data);
            setProductos([]);
          }
        })
        .catch((error) => {
          console.error("No hay productos, error: ", error);
          setProductos([]);
        });

      // Obtener los pedidos realizados al usuario
      Axios.post("http://localhost:4000/GetPedidosByVendedor", {
        id_user: user.id,
      })
        .then((response) => {
          if (Array.isArray(response.data)) {
            setPedidos(response.data);
          } else {
            console.error("Expected an array but got:", response.data);
            setPedidos([]);
          }
        })
        .catch((error) => {
          console.error("No hay pedidos, error: ", error);
          setPedidos([]);
        });

      // Obtener todos los pedidos del usuario
      ObtenerTodosLosPedidos(user.id);
    }
  }, [userlist, isAdmin]);

  // Renderizar el contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case "perfil":
        return (
          <div className="profile-content-wrapper">
            <div className="welcome-section">
              <h1 className="welcome-title">
                ¡Bienvenido, <span className="user-name">{nombre}</span>!
              </h1>
              <div className="welcome-divider"></div>
              <p className="welcome-subtitle">
                Aquí puedes gestionar tu cuenta y actividades
              </p>
            </div>

            <div className="profile-info-card">
              <div className="profile-info-header">
                <FaUser className="profile-icon" />
                <h2>Información del Perfil</h2>
              </div>
              <div className="profile-info-content">
                <div className="info-item">
                  <span className="info-label">
                    <FaUser /> Nombre:
                  </span>
                  <span className="info-value">{nombre}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    <FaEnvelope /> Correo:
                  </span>
                  <span className="info-value">{correo}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    <FaHandSparkles /> ID de usuario:
                  </span>
                  <span className="info-value">{id_user}</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "productos":
        return (
          <div className="profile-content-wrapper">
            <h2 className="section-title">
              <FaBox /> Mis Productos
            </h2>

            {Array.isArray(productos) && productos.length > 0 ? (
              <div className="action-link">
                <Link to="/sell" className="sell-link">
                  <AiFillShopping /> Vender más productos
                </Link>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-content">
                  <FaUpload className="empty-icon" />
                  <h3>No tienes productos aún</h3>
                  <p>Comienza a vender subiendo tu primer producto</p>
                  <Link to="/sell" className="cta-button">
                    Subir producto
                  </Link>
                </div>
              </div>
            )}

            {Array.isArray(productos) && productos.length > 0 && (
              <div className="productos-lista">
                {productos.map((item) => (
                  <div className="producto-item" key={item.id}>
                    <Item
                      id={item.id}
                      name={item.titulo}
                      image={`http://localhost:4000/${item.img1}`}
                      old_price={item.old_price}
                      new_price={item.new_price}
                    />
                    <button
                      className="eliminar-btn"
                      type="button"
                      onClick={() => EliminarProducto(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "pedidos":
        return (
          <div className="profile-content-wrapper">
            <h2 className="section-title">
              <FaBoxOpen /> Pedidos Recibidos
            </h2>

            {Array.isArray(pedidos) && pedidos.length > 0 ? (
              <div className="pedidos-lista">
                {pedidos.map((pedido) => (
                  <div className="pedido-item" key={pedido.id}>
                    <div className="pedido-header">
                      <h3>Pedido #{pedido.id}</h3>
                      <span className="pedido-status">Pendiente</span>
                    </div>
                    <div className="pedido-content">
                      <div className="pedido-image">
                        <img
                          src={`http://localhost:4000/${pedido.img1}`}
                          alt={pedido.titulo}
                          className="pedido-img"
                        />
                      </div>
                      <div className="pedido-details">
                        <p>
                          <strong>Producto:</strong> {pedido.titulo}
                        </p>
                        <p>
                          <strong>Cantidad:</strong> {pedido.cantidad}
                        </p>
                        <p>
                          <strong>Precio:</strong> ${pedido.precio}
                        </p>
                        <p>
                          <strong>Tamaño:</strong> {pedido.tamaño}
                        </p>
                        <p>
                          <strong>Dirección:</strong> {pedido.direccion}
                        </p>
                        <p>
                          <strong>Método de pago:</strong> {pedido.tipo_pago}
                        </p>
                      </div>
                    </div>
                    <button
                      className="eliminar-btn"
                      type="button"
                      onClick={() => CancelarPedido(pedido.id)}
                    >
                      Cancelar Pedido
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-content">
                  <FaBoxOpen className="empty-icon" />
                  <h3>No tienes pedidos recibidos</h3>
                  <p>
                    Cuando recibas pedidos por tus productos, aparecerán aquí
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case "todos-pedidos":
        return (
          <div className="profile-content-wrapper">
            <h2 className="section-title">
              <FaHistory /> Todos mis Pedidos
            </h2>

            {Array.isArray(todosLosPedidos) && todosLosPedidos.length > 0 ? (
              <div className="pedidos-lista">
                {todosLosPedidos.map((pedido) => (
                  <div className="pedido-item" key={pedido.id}>
                    <div className="pedido-header">
                      <h3>Pedido #{pedido.id}</h3>
                      <span className="pedido-status">Completado</span>
                    </div>
                    <div className="pedido-content">
                      <div className="pedido-image">
                        <img
                          src={`http://localhost:4000/${pedido.img1}`}
                          alt={pedido.titulo}
                          className="pedido-img"
                        />
                      </div>
                      <div className="pedido-details">
                        <p>
                          <strong>Producto:</strong> {pedido.titulo}
                        </p>
                        <p>
                          <strong>Cantidad:</strong> {pedido.cantidad}
                        </p>
                        <p>
                          <strong>Precio:</strong> ${pedido.precio}
                        </p>
                        <p>
                          <strong>Tamaño:</strong> {pedido.tamaño}
                        </p>
                        <p>
                          <strong>Dirección:</strong> {pedido.direccion}
                        </p>
                        <p>
                          <strong>Método de pago:</strong> {pedido.tipo_pago}
                        </p>
                      </div>
                    </div>
                    <button
                      className="eliminar-btn"
                      id="button-products"
                      type="button"
                      onClick={() => CancelarPedido(pedido.id)}
                    >
                      Cancelar Pedido
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-content">
                  <FaHistory className="empty-icon" />
                  <h3>No has realizado pedidos</h3>
                  <p>Cuando realices pedidos, aparecerán aquí</p>
                </div>
              </div>
            )}
          </div>
        );
      case "configuracion":
        return (
          <div className="profile-content-wrapper">
            <h2 className="section-title">
              <FaCog /> Configuración
            </h2>

            <div className="settings-grid">
              <Link to="/direcciones" className="settings-card">
                <div className="settings-icon">
                  <FaEnvelope />
                </div>
                <h3>Direcciones</h3>
                <p>Gestiona tus direcciones de envío</p>
              </Link>

              <Link to="/CardRegister" className="settings-card">
                <div className="settings-icon">
                  <PaymentIcon type="visa" format="flatRounded" width={30} />
                  <PaymentIcon
                    type="mastercard"
                    format="flatRounded"
                    width={30}
                  />
                </div>
                <h3>Métodos de Pago</h3>
                <p>Administra tus tarjetas registradas</p>
              </Link>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="sidebar-header">
          <h3>Mi Cuenta</h3>
        </div>

        <button
          className={`sidebar-btn ${
            activeSection === "perfil" ? "active" : ""
          }`}
          onClick={() => setActiveSection("perfil")}
        >
          <FaUser /> Perfil
        </button>

        {!isAdmin && (
          <>
            <button
              className={`sidebar-btn ${
                activeSection === "productos" ? "active" : ""
              }`}
              onClick={() => setActiveSection("productos")}
            >
              <FaBox /> Mis Productos
            </button>

            <button
              className={`sidebar-btn ${
                activeSection === "pedidos" ? "active" : ""
              }`}
              onClick={() => setActiveSection("pedidos")}
            >
              <FaBoxOpen /> Pedidos Recibidos
            </button>

            <button
              className={`sidebar-btn ${
                activeSection === "todos-pedidos" ? "active" : ""
              }`}
              onClick={() => setActiveSection("todos-pedidos")}
            >
              <FaHistory /> Todos mis Pedidos
            </button>

            <button
              className={`sidebar-btn ${
                activeSection === "configuracion" ? "active" : ""
              }`}
              onClick={() => setActiveSection("configuracion")}
            >
              <FaCog /> Configuración
            </button>
          </>
        )}
      </div>

      <div className="profile-main">{renderContent()}</div>
    </div>
  );
};

export default PagPerfil;
