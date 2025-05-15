import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./CartItems.css";
import { ShopContext } from "../../context/ShopContext";
import cart_cross_icon from "../assets/cart_cross_icon.png";
import Axios from "axios";
import { FormContext } from "../../context/FormContext";
import { Link, useNavigate } from "react-router-dom";
import { AiFillShopping } from "react-icons/ai";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AiOutlineCrown } from "react-icons/ai";
import { AiOutlineDollar } from "react-icons/ai";
import { AiOutlineNumber } from "react-icons/ai";
import { AiOutlineCalculator } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineCreditCard } from "react-icons/ai";



const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } =
    useContext(ShopContext);
  const { userlist, cardlist, setCard } = useContext(FormContext);
  const navigate = useNavigate();

  const [Nombre, Setnombre] = useState("");
  const [Numero, Setnumero] = useState("");
  const [Expiracion, Setexpira] = useState("");
  const [CVV, Setcvv] = useState("");
  const [tamaño, Settamaño] = useState("");
  const [direccion, Setdireccion] = useState("");
  const [id_producto, Setidproducto] = useState("");
  const [cantidad, Setcantidad] = useState("");
  const [precio, Setprecio] = useState("");

  const tipo_pago = "tarjeta";

  let id_user = userlist.length > 0 ? userlist[0].id : null;

  const validateCard = () => {
    if (!Nombre || !Numero || !Expiracion || !CVV) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos.",
      });
      return false;
    }
    if (Numero.length !== 16) {
      Swal.fire({
        icon: "error",
        title: "Número de tarjeta inválido",
        text: "El número de la tarjeta debe tener 16 dígitos.",
      });
      return false;
    }
    if (CVV.length < 3 || CVV.length > 4) {
      Swal.fire({
        icon: "error",
        title: "CVV inválido",
        text: "El CVV debe tener 3 o 4 dígitos.",
      });
      return false;
    }
    return true;
  };

  const AddCard = () => {
    if (validateCard()) {
      Axios.post("http://localhost:4000/AgregarTarjeta", {
        Nombre: Nombre,
        Numero: Numero,
        Expiracion: Expiracion,
        CVV: CVV,
        id_user: id_user,
      })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Tarjeta registrada",
            text: "Tu tarjeta ha sido registrada exitosamente.",
          });
          // Después de agregar la tarjeta, actualizamos el estado
          fetchCardDetails(id_user);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error al registrar",
            text: "Ocurrió un problema al intentar registrar tu tarjeta.",
          });
          console.error("Error al registrar la tarjeta:", error);
        });
    }
  };

  const fetchCardDetails = (userId) => {
    Axios.post("http://localhost:4000/SearchCard", {
      id_user: userId,
    })
      .then((response) => {
        if (response.data.length === 0) {
          Swal.fire({
            icon: "info",
            title: "Sin tarjeta registrada",
            text: "Parece que no tienes tarjeta de crédito, regístrala para continuar.",
          }).then(() => {
            // Redirigir después de cerrar el mensaje
            navigate("/CardRegister");
          });
        } else {
          setCard(response.data); // Actualiza el estado con los detalles de la tarjeta
        }
      })
      .catch((error) => {
        console.error("Error al buscar la tarjeta:", error);
      });
  };
  useEffect(() => {
    if (id_user) {
      fetchCardDetails(id_user);
    }
  }, [id_user]);

  useEffect(() => {
    if (all_product.length > 0 && cartItems) {
      const product = all_product.find((p) => cartItems[p.id] > 0);
      if (product) {
        Setidproducto(product.id);
        Setcantidad(cartItems[product.id]);
        Setprecio(product.new_price * cartItems[product.id]);
      }
    }
  }, [all_product, cartItems]);

  const AddOrder = () => {
    Axios.post("http://localhost:4000/CrearPedido", {
      id_producto: id_producto,
      id_user: id_user,
      tamaño: tamaño,
      cantidad: cantidad,
      direccion: direccion,
      tipo_pago: tipo_pago,
      precio: precio,
    })
      .then((response) => {
        if (response.data === "Verdadero") {
          Swal.fire({
            icon: "success",
            title: "Pedido creado",
            text: "Pedido creado con éxito, puedes ver su estado en tu perfil.",
          });
          navigate("/");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al crear el pedido",
            text: "Hubo un problema al crear el pedido.",
          });
        }
      })
      .catch((error) => {
        console.error("Error al crear el pedido:", error);
        Swal.fire({
          icon: "error",
          title: "Error al crear el pedido",
          text: "Ocurrió un error al crear el pedido.",
        });
      });
  };

  const isCardRegistered = cardlist.length !== 0;

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>
          <AiOutlineShoppingCart /> Productos
        </p>
        <p>
          {" "}
          <AiOutlineCrown /> Título
        </p>
        <p>
          {" "}
          <AiOutlineDollar /> Precio
        </p>
        <p>
          {" "}
          <AiOutlineNumber />
          Cantidad
        </p>
        <p>
          {" "}
          <AiOutlineCalculator /> Total
        </p>
        <p>
          {" "}
          <AiOutlineDelete /> Quitar
        </p>
      </div>
      <hr />

      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems_format cartitems-format-main">
                <img
                  src={`http://localhost:4000/${e.img1}`}
                  alt=""
                  className="cartitems-product-icon"
                />
                <p>{e.titulo}</p>
                <p>{e.new_price}</p>
                <button className="cartitems-quantity">
                  {cartItems[e.id]}
                </button>
                <p>{e.new_price * cartItems[e.id]}</p>
                <img
                  className="cartitems-remove-icon"
                  src={cart_cross_icon}
                  onClick={() => {
                    removeFromCart(e.id);
                  }}
                  alt=""
                />
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      {!isCardRegistered ? (
        /* cuando el usuario no tiene tarjeta */
        <li>
          <Link to="/CardRegister">
            <AiFillShopping /> Registrar una tarjeta
          </Link>
        </li>
      ) : (
        <p>Disfruta tus productos 😊👌</p>
      )}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Compra</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <label className="label-cart">
           Medidas del producto:
            <input
              onChange={(event) => {
                Settamaño(event.target.value);
              }}
              className="cartitems-total-item imput-cart"
              type="text"
              placeholder="Largo x Ancho x Alto"
            />
          </label>

          <label className="label-cart">
            <h1>Direccion de envio:</h1>

          <li>
            <li>Direcciones:</li>
          </li>
          <br />
            <input
              onChange={(event) => {
                Setdireccion(event.target.value);
              }}
              className="cartitems-total-item imput-cart"
              type="text"
              placeholder="Pais, Estado, Municipio, CP, Colonia, Calle y Num."
            />
          </label>


          <h1>Metodo de pago:</h1>
          <li>
            <li>Tarjetas:</li>
          </li>
          <br />

          {isCardRegistered ? (
            <button onClick={AddOrder}>
              {" "}
              <AiOutlineCreditCard /> Proceder con la compra
            </button>
          ) : (
            <h2>Registra una tarjeta de crédito para desbloquear🔐</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItems;
