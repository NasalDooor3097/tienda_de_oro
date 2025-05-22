import React, { useContext, useState, useEffect } from "react";
import "./PagPerfil.css";
import { FormContext } from "../../context/FormContext";
import Axios from "axios";
import Item from "../Item/Item";
import { Link, useNavigate } from "react-router-dom";
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
  const { userlist, logout } = useContext(FormContext);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [id_user, setIdUser] = useState("");
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [todosLosPedidos, setTodosLosPedidos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVendedor, setIsVendedor] = useState(false); // Nuevo estado para vendedor
  const [activeSection, setActiveSection] = useState("perfil");
  const [pedidosCompletos, setPedidosCompletos] = useState([]);
  const [pedidosDelVendedor, setPedidosDelVendedor] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Estados para controlar qué datos se han cargado
  const [datosInicalesCargados, setDatosInicalesCargados] = useState(false);
  const [pedidosPendientesCargados, setPedidosPendientesCargados] =
    useState(false);
  const [pedidosCompletosCargados, setPedidosCompletosCargados] =
    useState(false);

  // Verificar si el usuario es administrador y vendedor
  useEffect(() => {
    if (userlist.length > 0) {
      const user = userlist[0];
      setNombre(user.user_name);
      setCorreo(user.email);
      setIdUser(user.id);
      
      // Verificar si es vendedor basándose en el campo tipo
      setIsVendedor(user.tipo === "vendedor");

      Axios.post("http://localhost:4000/SearchAdmin", {
        nombre: user.user_name,
        correo: user.email,
        password: user.password,
      })
        .then((response) => {
          setIsAdmin(response.data.length > 0);
        })
        .catch((error) => {
          console.error("Error al verificar administrador:", error);
          setIsAdmin(false);
        });
    }
  }, [userlist]);

  // Cargar datos iniciales cuando el usuario no es admin
  useEffect(() => {
    if (userlist.length > 0 && !isAdmin && id_user && !datosInicalesCargados) {
      cargarDatosIniciales();
    }
  }, [userlist, isAdmin, id_user, datosInicalesCargados]);

  // Función para cargar todos los datos iniciales
  const cargarDatosIniciales = async () => {
    if (!id_user || datosInicalesCargados) return;

    try {
      setLoading(true);

      // Solo cargar productos si es vendedor
      if (isVendedor) {
        const productosResponse = await Axios.post(
          "http://localhost:4000/SearchProduct",
          {
            id_user: id_user,
          }
        );
        setProductos(
          Array.isArray(productosResponse.data) ? productosResponse.data : []
        );

        // Cargar pedidos realizados al usuario (solo vendedores)
        const pedidosResponse = await Axios.post(
          "http://localhost:4000/GetPedidosByVendedor",
          {
            id_user: id_user,
          }
        );
        setPedidos(
          Array.isArray(pedidosResponse.data) ? pedidosResponse.data : []
        );

        // Cargar pedidos del vendedor
        const pedidosVendedorResponse = await Axios.post(
          "http://localhost:4000/PedidosDelVendedor",
          {
            id_user: id_user,
          }
        );
        setPedidosDelVendedor(
          Array.isArray(pedidosVendedorResponse.data)
            ? pedidosVendedorResponse.data
            : []
        );
      }

      setDatosInicalesCargados(true);
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener pedidos pendientes (solo cuando se necesite)
  const obtenerPedidosPendientes = async () => {
    if (!id_user || id_user === "" || pedidosPendientesCargados) {
      console.log("No se puede obtener pedidos pendientes. id_user:", id_user);
      return;
    }

    try {
      setLoading(true);
      console.log("Obteniendo pedidos pendientes para usuario:", id_user);

      const response = await Axios.post("http://localhost:4000/SearchOrder", {
        id_user: id_user,
      });

      console.log("Respuesta pedidos pendientes:", response.data);
      setTodosLosPedidos(Array.isArray(response.data) ? response.data : []);
      setPedidosPendientesCargados(true);
    } catch (error) {
      console.error("Error al obtener pedidos pendientes:", error);
      setTodosLosPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener pedidos completados (solo cuando se necesite)
  const obtenerPedidosCompletos = async () => {
    if (!id_user || id_user === "" || pedidosCompletosCargados) {
      console.log("No se puede obtener pedidos completados. id_user:", id_user);
      return;
    }

    try {
      setLoading(true);
      console.log("Obteniendo pedidos completados para usuario:", id_user);

      const response = await Axios.post(
        "http://localhost:4000/SearchOrderCompleted",
        {
          id_user: id_user,
        }
      );

      console.log("Respuesta pedidos completados:", response.data);
      setPedidosCompletos(Array.isArray(response.data) ? response.data : []);
      setPedidosCompletosCargados(true);
    } catch (error) {
      console.error("Error al obtener pedidos completados:", error);
      setPedidosCompletos([]);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de sección activa
  const handleSectionChange = (section) => {
    // Limpiar datos de secciones anteriores para evitar interferencias
    if (activeSection !== section) {
      if (activeSection === "pedidos") {
        // Opcional: podrías limpiar todosLosPedidos si quieres recargar cada vez
        // setTodosLosPedidos([]);
        // setPedidosPendientesCargados(false);
      }
    }

    setActiveSection(section);

    // Solo cargar datos si id_user tiene un valor válido
    if (!id_user || id_user === "") {
      console.log("id_user no está disponible aún:", id_user);
      return;
    }

    // Cargar datos específicos según la sección solo si no se han cargado antes
    if (section === "pedidos" && !pedidosPendientesCargados) {
      console.log("Cargando pedidos pendientes...");
      obtenerPedidosPendientes();
    } else if (section === "pedidosCompletos" && !pedidosCompletosCargados) {
      console.log("Cargando pedidos completados...");
      obtenerPedidosCompletos();
    }
  };

  // Función para eliminar un producto (solo vendedores)
  const EliminarProducto = (id) => {
    if (!isVendedor) {
      Swal.fire("Error", "Solo los vendedores pueden eliminar productos.", "error");
      return;
    }

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

  // Función para marcar pedido como enviado (solo vendedores)
  const enviado = (id_pedido) => {
    if (!isVendedor) {
      Swal.fire("Error", "Solo los vendedores pueden marcar pedidos como enviados.", "error");
      return;
    }

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
        Axios.post("http://localhost:4000/MarcarPedidoEnviado", {
          id_pedido: id_pedido,
        })
          .then(() => {
            // Actualizar la lista en lugar de recargar la página
            setPedidosDelVendedor((prev) =>
              prev.filter((pedido) => pedido.id !== id_pedido)
            );
            Swal.fire(
              "¡Enviado!",
              "El pedido se marcó como enviado.",
              "success"
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              "No se pudo marcar el pedido como enviado.",
              "error"
            );
            console.error("Error:", error);
          });
      }
    });
  };

  // Función para convertirse en vendedor (solo si no es vendedor)
  const convertToSeller = () => {
    if (isVendedor) {
      Swal.fire("Información", "Ya eres un vendedor registrado.", "info");
      return;
    }

    Swal.fire({
      title: '¡Conviértete en Vendedor!',
      html:
        '<p>Para empezar a vender, necesitamos tu información bancaria.</p>' +
        '<input id="swal-input1" class="swal2-input" placeholder="Número de cuenta bancaria">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const accountNumber = Swal.getPopup().querySelector('#swal-input1').value;
        if (!accountNumber) {
          Swal.showValidationMessage('Por favor, ingresa tu número de cuenta bancaria.');
        }
        return { accountNumber: accountNumber };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { accountNumber } = result.value;
        Axios.post("http://localhost:4000/Vendedor", {
          id_user: id_user,
          account_number: accountNumber
        })
        .then(() => {
          Swal.fire(
            '¡Felicidades!',
            'Ahora eres un vendedor. Tu información bancaria ha sido guardada.',
            'success'
          );
          logout();
          navigate("/login");
        })
        .catch((error) => {
          Swal.fire(
            'Error',
            'No se pudo procesar tu solicitud para convertirte en vendedor. Inténtalo de nuevo más tarde.',
            'error'
          );
          console.error("Error al convertir a vendedor:", error);
        });
      }
    });
  };

  // Renderizar el contenido según la sección activa
  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <p>Cargando...</p>
        </div>
      );
    }

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
                <div className="info-item">
                  <span className="info-label">
                    <FaHandSparkles /> Tipo de cuenta:
                  </span>
                  <span className="info-value">
                    {isVendedor ? "Vendedor" : "Usuario"}
                  </span>
                </div>

                {/* Solo mostrar el botón si NO es vendedor */}
                {!isVendedor && (
                  <button onClick={convertToSeller}>
                    Convertirme en vendedor
                  </button>
                )}

                {/* Mostrar mensaje si ya es vendedor */}
                {isVendedor && (
                  <div className="vendedor-badge">
                    <p>✅ Cuenta de vendedor activa</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "productos":
        // Solo vendedores pueden ver productos
        if (!isVendedor) {
          return (
            <div className="profile-content-wrapper">
              <div className="access-denied">
                <h2>Acceso Denegado</h2>
                <p>Solo los vendedores pueden gestionar productos.</p>
                <p>Conviértete en vendedor desde tu perfil para acceder a esta sección.</p>
              </div>
            </div>
          );
        }

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
                {productos.map((item, index) => (
                  <div
                    className="producto-item"
                    key={`producto-${item.id}-${index}`}
                  >
                    <Item
                      id={item.id}
                      name={item.titulo}
                      image={`http://localhost:4000/${item.img1}`}
                      new_price={item.new_price}
                    />
                    <div className="button-container">
                      <button
                        className="eliminar-btn"
                        type="button"
                        onClick={() => EliminarProducto(item.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
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
            {/* Solo mostrar pedidos pendientes si estamos en esta sección específica */}
            {activeSection === "pedidos" &&
            Array.isArray(todosLosPedidos) &&
            todosLosPedidos.length > 0 ? (
              <div className="pedidos-lista">
                {todosLosPedidos.map((pedidoTodo, index) => (
                  <div
                    className="pedido-item"
                    key={`pedido-pendiente-${pedidoTodo.id}-${index}`}
                  >
                    <div className="pedido-header">
                      <h3>Producto: {pedidoTodo.titulo}</h3>
                      <p>Status: {pedidoTodo.status}</p>
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
                        {pedidoTodo.direccion &&
                        typeof pedidoTodo.direccion === "object" ? (
                          <div className="direccion-detalle">
                            <p>
                              {pedidoTodo.direccion.calle} #
                              {pedidoTodo.direccion.numero_exterior}
                            </p>
                            {pedidoTodo.direccion.numero_departamento && (
                              <p>
                                Departamento:{" "}
                                {pedidoTodo.direccion.numero_departamento}
                              </p>
                            )}
                            <p>{pedidoTodo.direccion.colonia}</p>
                            <p>
                              {pedidoTodo.direccion.ciudad},{" "}
                              {pedidoTodo.direccion.estado}
                            </p>
                            <p>C.P. {pedidoTodo.direccion.codigo_postal}</p>
                          </div>
                        ) : (
                          <p>Dirección no disponible</p>
                        )}
                      </div>
                    </div>

                    <div className="button-container">
                      <button
                        className="cancelar-pedido-btn"
                        type="button"
                        onClick={() => CancelarPedido(pedidoTodo.id)}
                      >
                        ❌ Cancelar Pedido
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-content">
                  <FaBoxOpen className="empty-icon" />
                  <h3>No tienes pedidos pendientes</h3>
                  <p>Cuando tengas pedidos pendientes, aparecerán aquí</p>
                </div>
              </div>
            )}
          </div>
        );

      case "pedidosCompletos":
        return (
          <div className="profile-content-wrapper">
            <h2 className="section-title">
              <FaHistory /> Pedidos Completados
            </h2>
            {/* Solo mostrar pedidos completados si estamos en esta sección específica */}
            {activeSection === "pedidosCompletos" &&
            Array.isArray(pedidosCompletos) &&
            pedidosCompletos.length > 0 ? (
              <div className="pedidos-lista">
                {pedidosCompletos.map((pedido, index) => (
                  <div
                    className="pedido-item"
                    key={`pedido-completado-${pedido.id}-${index}`}
                  >
                    <div className="pedido-header">
                      <h3>{pedido.titulo}</h3>
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
                          <strong>Precio nuevo:</strong> ${pedido.new_price}
                        </p>
                        <p>
                          <strong>Precio anterior:</strong> ${pedido.old_price}
                        </p>
                        <p>
                          <strong>Cantidad:</strong> {pedido.cantidad}
                        </p>
                        <p>
                          <strong>Dirección:</strong>
                        </p>
                        <div className="direccion-detalle">
                          <p>
                            {pedido.calle} #{pedido.numero_exterior}
                          </p>
                          {pedido.vivienda && (
                            <p>Vivienda: {pedido.vivienda}</p>
                          )}
                          <p>{pedido.colonia}</p>
                          <p>
                            {pedido.ciudad}, {pedido.estado}
                          </p>
                          <p>C.P. {pedido.codigo_postal}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-content">
                  <FaHistory className="empty-icon" />
                  <h3>No hay pedidos completados</h3>
                  <p>Los pedidos completados aparecerán aquí</p>
                </div>
              </div>
            )}
          </div>
        );

      case "todos-pedidos":
        // Solo vendedores pueden ver pedidos por enviar
        if (!isVendedor) {
          return (
            <div className="profile-content-wrapper">
              <div className="access-denied">
                <h2>Acceso Denegado</h2>
                <p>Solo los vendedores pueden ver pedidos por enviar.</p>
                <p>Conviértete en vendedor desde tu perfil para acceder a esta sección.</p>
              </div>
            </div>
          );
        }

        return (
          <div className="profile-content-wrapper">
            <h2 className="section-title">
              <FaHistory /> Pedidos por Enviar
            </h2>

            {/* Solo mostrar pedidos del vendedor si estamos en esta sección específica */}
            {activeSection === "todos-pedidos" &&
            Array.isArray(pedidosDelVendedor) &&
            pedidosDelVendedor.length > 0 ? (
              <div className="pedidos-lista">
                {pedidosDelVendedor.map((pedido, index) => (
                  <div
                    className="pedido-item"
                    key={`pedido-vendedor-${pedido.id}-${index}`}
                  >
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
                        <p>
                          <strong>Precio nuevo:</strong> ${pedido.new_price}
                        </p>
                        <p>
                          <strong>Precio anterior:</strong> ${pedido.old_price}
                        </p>
                        <p>
                          <strong>Cantidad:</strong> {pedido.cantidad}
                        </p>
                        <p>
                          <strong>Dirección:</strong>
                        </p>
                        <div className="direccion-detalle">
                          <p>
                            {pedido.calle} #{pedido.numero_exterior}
                          </p>
                          {pedido.numero_departamento && (
                            <p>Departamento: {pedido.numero_departamento}</p>
                          )}
                          <p>{pedido.colonia}</p>
                          <p>
                            {pedido.ciudad}, {pedido.estado}
                          </p>
                          <p>C.P. {pedido.codigo_postal}</p>
                        </div>
                      </div>
                    </div>
                    <div className="button-container">
                      <button
                        className="marcar-enviado-btn"
                        type="button"
                        onClick={() => enviado(pedido.id)}
                      >
                        📦 Marcar como enviado
                      </button>
                    </div>
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
          className={`sidebar-btn ${
            activeSection === "perfil" ? "active" : ""
          }`}
          onClick={() => handleSectionChange("perfil")}
        >
          <FaUser /> Perfil
        </button>

        {!isAdmin && (
          <>
            {/* Solo mostrar sección de productos si es vendedor */}
            {isVendedor && (
              <button
                className={`sidebar-btn ${
                  activeSection === "productos" ? "active" : ""
                }`}
                onClick={() => handleSectionChange("productos")}
              >
                <FaBox /> Mis Productos
              </button>
            )}

            <button
              className={`sidebar-btn ${
                activeSection === "pedidos" ? "active" : ""
              }`}
              onClick={() => handleSectionChange("pedidos")}
            >
              <FaBoxOpen /> Pedidos pendientes
            </button>

            <button
              className={`sidebar-btn ${
                activeSection === "pedidosCompletos" ? "active" : ""
              }`}
              onClick={() => handleSectionChange("pedidosCompletos")}
            >
              <FaHistory /> Pedidos completados
            </button>

            {/* Solo mostrar sección de pedidos por enviar si es vendedor */}
            {isVendedor && (
              <button
                className={`sidebar-btn ${
                  activeSection === "todos-pedidos" ? "active" : ""
                }`}
                onClick={() => handleSectionChange("todos-pedidos")}
              >
                <FaBoxOpen /> Pedidos por enviar
              </button>
            )}

            <button
              className={`sidebar-btn ${
                activeSection === "configuracion" ? "active" : ""
              }`}
              onClick={() => handleSectionChange("configuracion")}
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