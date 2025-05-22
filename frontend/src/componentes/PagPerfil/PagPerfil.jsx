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
  const [pedidosCompletos, setPedidosCompletos] = useState([]);
  const [pedidosDelVendedor, setPedidosDelVendedor] = useState([]);

  // Verificar si el usuario es administrador jijij
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












  // Función para obtener todos los pedidos pendientes del usuario
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
    const obtenerPedidos = async () => {
      try {
        const response = await Axios.post("http://localhost:4000/PedidosDelVendedor", { id_user });
        setPedidosDelVendedor(response.data);
      } catch (err) {
        console.error("Error al obtener los pedidos:", err);
      } 
    };
    obtenerPedidos();
  }, [id_user]);












    const enviado = (id_pedido) => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás deshacer esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, enviar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          Axios.post("http://localhost:4000/MarcarPedidoEnviado", { id_pedido: id_pedido })
            .then(() => {
              window.location.reload();
            });
        }
      });
    }










  // Función para obtener todos los pedidos completados del usuario
  const ObtenerTodosLosPedidosCompletos = (id_user) => {
    Axios.post("http://localhost:4000/SearchOrderCompleted", { id_user: id_user })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPedidosCompletos(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setPedidosCompletos([]);
        }
      })
      .catch((error) => {
        console.error("No se pudieron obtener los pedidos, error: ", error);
        setPedidosCompletos([]);
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
      ObtenerTodosLosPedidosCompletos(id_user);
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
                      new_price={item.new_price}
                    />
                    <button
                      className="eliminar-btn"
                      type="button"
                      onClick={() => EliminarProducto(item.id)}
                    >
                      X
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
              <FaBoxOpen /> Pedidos Pendientes
            </h2>
            {Array.isArray(todosLosPedidos) && todosLosPedidos.length > 0 ? (
              <div className="pedidos-lista">
                {todosLosPedidos.map((pedidoTodo) => (
                  <div className="pedido-item" key={pedidoTodo.id}>
                    <div className="pedido-header">
                      <h3>Producto: {pedidoTodo.titulo}</h3>
                      <p>status: {pedidoTodo.status} </p>
                      <span className="pedido-status">
                        {pedidoTodo.status == 0
                          ? "Pendiente de envío"
                          : pedidoTodo.status == 1
                          ? "En proceso de repartirlo"
                          : "Pendiente"}
                      </span>
                    </div>
                    <div className="pedido-content">
                      <div className="pedido-image">
                        <img
                          src={`http://localhost:4000/${pedidoTodo.img1}`}
                          alt={pedidoTodo.titulo}
                          className="pedido-img"
                        />
                      </div>
                      <div className="pedido-details">
                        <p>
                          <strong>Cantidad:</strong> {pedidoTodo.cantidad}
                        </p>
                        <p>
                          <strong>Precio:</strong> ${pedidoTodo.new_price}
                        </p>
                        <p>
                          <strong>Dirección:</strong>
                        </p>
                        {pedidoTodo.direccion && typeof pedidoTodo.direccion === "object" ? (
                          <div className="direccion-detalle">
                            <p>
                              {pedidoTodo.direccion.calle} #
                              {pedidoTodo.direccion.numero_exterior}
                            </p>
                            {pedidoTodo.direccion.numero_departamento && (
                              <p>Departamento: {pedidoTodo.direccion.numero_departamento}</p>
                            )}
                            <p>{pedidoTodo.direccion.colonia}</p>
                            <p>
                              {pedidoTodo.direccion.ciudad}, {pedidoTodo.direccion.estado}
                            </p>
                            <p>C.P. {pedidoTodo.direccion.codigo_postal}</p>
                          </div>
                        ) : (
                          <p>Dirección no disponible</p>
                        )}
                      </div>
                    </div>
                    <button
                      className="eliminar-btn"
                      type="button"
                      onClick={() => CancelarPedido(pedidoTodo.id)}
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
                  <p>Cuando recibas pedidos por tus productos, aparecerán aquí</p>
                </div>
              </div>
            )}
          </div>
        );








      case "pedidosCompletos":
        return (
          <div>
            <h2>Pedidos completados</h2>
            {pedidosCompletos.length === 0 ? (
                <p>No hay pedidos disponibles.</p>
            ) : (
                <ul>
                    {pedidosCompletos.map((pedido) => (
                        <li key={pedido.id}>
                            <h3>{pedido.titulo}</h3>
                            <p>Precio nuevo: ${pedido.new_price}</p>
                            <p>Precio anterior: ${pedido.old_price}</p>
                            <p>Cantidad: {pedido.cantidad}</p>
                            <p>Dirección: {pedido.calle}, {pedido.numero_exterior}, {pedido.vivienda}, {pedido.colonia}, {pedido.ciudad}, {pedido.estado}, {pedido.codigo_postal}</p>
                            <img src={`http://localhost:4000/${pedido.img1}`} alt={pedido.titulo} width="100" />
                        </li>
                    ))}
                </ul>
            )}


          </div>
        );






      case "todos-pedidos":
        return (
          <div className="profile-content-wrapper">
            <h2 className="section-title">
              <FaHistory /> Pedidos por Enviar
            </h2>

            {Array.isArray(pedidosDelVendedor) && pedidosDelVendedor.length > 0 ? (
              <div className="pedidos-lista">
                {pedidosDelVendedor.map((pedido) => (
                  <div className="pedido-item" key={pedido.id}>
                    <div className="pedido-header">
                      <h3>{pedido.titulo}</h3>
                      <span className="pedido-status">Por enviar</span>
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
                        <p><strong>Precio nuevo:</strong> ${pedido.new_price}</p>
                        <p><strong>Precio anterior:</strong> ${pedido.old_price}</p>
                        <p><strong>Cantidad:</strong> {pedido.cantidad}</p>
                        <p><strong>Dirección:</strong></p>
                        <div className="direccion-detalle">
                          <p>{pedido.calle} #{pedido.numero_exterior}</p>
                          {pedido.numero_departamento && (
                            <p>Departamento: {pedido.numero_departamento}</p>
                          )}
                          <p>{pedido.colonia}</p>
                          <p>{pedido.ciudad}, {pedido.estado}</p>
                          <p>C.P. {pedido.codigo_postal}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      className="marcar-enviado-btn"
                      type="button"
                      onClick={() => enviado(pedido.id)}
                    >
                      Marcar como enviado
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-content">
                  <FaBoxOpen className="empty-icon" />
                  <h3>No tienes pedidos por enviar</h3>
                  <p>Los pedidos que necesites enviar aparecerán aquí</p>
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
          className={`sidebar-btn ${activeSection === "perfil" ? "active" : ""}`}
          onClick={() => setActiveSection("perfil")}
        >
          <FaUser /> Perfil
        </button>

        {!isAdmin && (
          <>
            <button
              className={`sidebar-btn ${activeSection === "productos" ? "active" : ""}`}
              onClick={() => setActiveSection("productos")}
            >
              <FaBox /> Mis Productos
            </button>

            <button
              className={`sidebar-btn ${activeSection === "pedidos" ? "active" : ""}`}
              onClick={() => setActiveSection("pedidos")}
            >
              <FaBoxOpen /> Pedidos pendientes
            </button>

            <button
              className={`sidebar-btn ${activeSection === "pedidosCompletos" ? "active" : ""}`}
              onClick={() => setActiveSection("pedidosCompletos")}
            >
              <FaHistory /> Pedidos completados
            </button>

            <button
              className={`sidebar-btn ${activeSection === "todos-pedidos" ? "active" : ""}`}
              onClick={() => setActiveSection("todos-pedidos")}
            >
              <FaBoxOpen /> Pedidos por enviar
            </button>

            <button
              className={`sidebar-btn ${activeSection === "configuracion" ? "active" : ""}`}
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