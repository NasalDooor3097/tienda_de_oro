import React, { useContext, useEffect, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../context/ShopContext";
import { FormContext } from "../../context/FormContext";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";

// Icons
import {
  FaShoppingCart,
  FaCrown,
  FaDollarSign,
  FaHashtag,
  FaCalculator,
  FaTrashAlt,
  FaMapMarkerAlt,
  FaLock,
  FaCheckCircle,
  FaHome,
  FaBuilding,
  FaCreditCard,
  FaBox,
  FaPlus,
} from "react-icons/fa";

const CartItems = () => {
  const {
    getTotalCartAmount,
    all_product,
    cartItems,
    removeFromCart,
    idDireccion,
    Setiddireccion,
    precio,
    Setprecio,
    id_producto,
    Setidproducto,
    cantidad,
    Setcantidad,
  } = useContext(ShopContext);

  const { userlist } = useContext(FormContext);
  const navigate = useNavigate();

  const [direcciones, setDireccionesGuardadas] = useState([]);
  const id_user = userlist.length > 0 ? userlist[0].id : null;

  // Handle selecting a shipping address
  const seleccionarDireccion = (id) => {
    Setiddireccion(id);
    Swal.fire({
      icon: "success",
      title: "Dirección seleccionada",
      text: "Esta dirección se usará para tu envío",
      showConfirmButton: false,
      timer: 1500,
      position: "top-end",
      toast: true,
    });
  };

  // Clear selected address
  const cambiarDireccion = () => {
    Setiddireccion("");
  };

  // Load saved addresses
  const cargarDirecciones = async () => {
    if (!id_user) return;

    try {
      const response = await Axios.post(
        "http://localhost:4000/BuscarDirecciones",
        { id_user }
      );
      setDireccionesGuardadas(response.data || []);
    } catch (error) {
      console.error("Error al cargar direcciones:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar tus direcciones guardadas",
        confirmButtonColor: "#4a6cf7",
      });
    }
  };

  // Initial load of addresses
  useEffect(() => {
    if (id_user) {
      cargarDirecciones();
    }
  }, [id_user]);

  // Update cart details whenever products or quantities change
  useEffect(() => {
    if (all_product.length > 0 && cartItems) {
      const productosEnCarrito = [];
      const cantidadesEnCarrito = [];

      all_product.forEach((producto) => {
        if (cartItems[producto.id] > 0) {
          productosEnCarrito.push(producto.id);
          cantidadesEnCarrito.push(cartItems[producto.id]);
        }
      });

      Setidproducto(productosEnCarrito);
      Setcantidad(cantidadesEnCarrito);
      Setprecio(getTotalCartAmount());
    }
  }, [all_product, cartItems]);

  // Check if required data is available for checkout
  const isDireccionSeleccionada = idDireccion !== "";
  const hayProductosEnCarrito = getTotalCartAmount() > 0;
  const puedeComprar = isDireccionSeleccionada && hayProductosEnCarrito;

  // Helper to format prices
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Check if cart is empty
  const isCartEmpty = !Object.values(cartItems).some(
    (quantity) => quantity > 0
  );

  return (
    <div className="cartitems">
      {/* Cart Header */}
      <div className="cart-header">
        <h2>
          <FaShoppingCart /> Mi Carrito de Compras
        </h2>
      </div>

      {isCartEmpty ? (
        <div className="empty-cart-message">
          <FaBox size={48} />
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos para continuar con tu compra</p>
          <Link to="/">
            <button className="checkout-button">Ir a la tienda</button>
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items Header */}
          <div className="cartitems-format-main">
            <p>
              <FaShoppingCart /> Producto
            </p>
            <p>
              <FaCrown /> Título
            </p>
            <p className="price-column">
              <FaDollarSign /> Precio
            </p>
            <p>
              <FaHashtag /> Cantidad
            </p>
            <p className="total-column">
              <FaCalculator /> Total
            </p>
            <p>
              <FaTrashAlt /> Eliminar
            </p>
          </div>
          <hr />

          {/* Cart Items List */}
          {all_product.map((producto) => {
            if (cartItems[producto.id] > 0) {
              return (
                <div key={producto.id}>
                  <div className="cartitems-format cartitems-format-main">
                    <div className="product-row">
                      <img
                        src={`http://localhost:4000/${producto.img1}`}
                        alt={producto.titulo}
                        className="cartitems-product-icon"
                      />
                    </div>
                    <p className="product-title">{producto.titulo}</p>
                    <p className="price-column">
                      {formatPrice(producto.new_price)}
                    </p>
                    <button className="cartitems-quantity">
                      {cartItems[producto.id]}
                    </button>
                    <p className="total-column">
                      {formatPrice(producto.new_price * cartItems[producto.id])}
                    </p>
                    <div>
                      <FaTrashAlt
                        className="cartitems-remove-icon"
                        onClick={() => removeFromCart(producto.id)}
                      />
                    </div>
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })}

          {/* Cart Summary */}
          <div className="cartitems-down">
            <div className="cartitems-total">
              <h1>Resumen de la Orden</h1>
              <div>
                <div className="cartitems-total-item">
                  <p>Subtotal</p>
                  <p>{formatPrice(getTotalCartAmount())}</p>
                </div>
                <hr />
                <div className="cartitems-total-item">
                  <p>Costo de envío</p>
                  <p>Gratis</p>
                </div>
                <hr />
                <div className="cartitems-total-item">
                  <h3>Total</h3>
                  <h3>{formatPrice(getTotalCartAmount())}</h3>
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="shipping-section">
                <h1>
                  <FaMapMarkerAlt /> Dirección de Envío
                </h1>

                {direcciones.length > 0 ? (
                  <div className="grid-direcciones">
                    {direcciones.map((direccion) => (
                      <div
                        key={direccion.id}
                        className={`tarjeta-direccion ${
                          idDireccion === direccion.id ? "selected" : ""
                        }`}
                      >
                        <div className="tarjeta-header">
                          <span className="badge-vivienda">
                            {direccion.vivienda === "Casa" ? (
                              <FaHome />
                            ) : (
                              <FaBuilding />
                            )}{" "}
                            {direccion.vivienda}
                          </span>
                          {direccion.vivienda === "Departamento" && (
                            <span className="badge-departamento">
                              Apto: {direccion.numero_departamento}
                            </span>
                          )}
                        </div>
                        <div className="tarjeta-body">
                          <p>
                            <span className="etiqueta">Dirección:</span>{" "}
                            {direccion.calle} #{direccion.numero_exterior}
                          </p>
                          <p>
                            <span className="etiqueta">Colonia:</span>{" "}
                            {direccion.colonia}
                          </p>
                          <p>
                            <span className="etiqueta">Ciudad:</span>{" "}
                            {direccion.ciudad}, {direccion.estado}
                          </p>
                          <p>
                            <span className="etiqueta">C.P.:</span>{" "}
                            {direccion.codigo_postal}
                          </p>

                          <div className="address-actions">
                            {idDireccion === "" ? (
                              <button
                                className="address-button"
                                onClick={() =>
                                  seleccionarDireccion(direccion.id)
                                }
                              >
                                <FaCheckCircle /> Usar
                              </button>
                            ) : idDireccion === direccion.id ? (
                              <button
                                className="address-button selected"
                                onClick={() => cambiarDireccion()}
                              >
                                <FaCheckCircle /> Seleccionada
                              </button>
                            ) : (
                              <button className="address-button locked">
                                <FaLock />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="sin-direcciones">
                    <p>No tienes direcciones guardadas</p>
                    <p>Agrega una dirección para continuar con tu compra</p>
                    <Link to="/profile">
                      <div className="add-address-button">
                        <FaPlus /> <Link to={"/direcciones"}>Agregar una direccion</Link>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              {puedeComprar ? (
                <Link to="/pago">
                  <button className="checkout-button">
                    <FaCreditCard /> Proceder al pago
                  </button>
                </Link>
              ) : (
                <button
                  className="checkout-button checkout-button-disabled"
                  disabled
                >
                  <FaLock />{" "}
                  {!isDireccionSeleccionada
                    ? "Selecciona una dirección"
                    : !hayProductosEnCarrito
                    ? "Agrega productos al carrito"
                    : "Completa la información"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartItems;
