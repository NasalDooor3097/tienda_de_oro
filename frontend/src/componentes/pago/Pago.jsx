import "./Pago.css";
import React, { useContext, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { FormContext } from "../../context/FormContext";

// Reemplaza con tu clave publicable
const stripePromise = loadStripe(
  "pk_test_51RQJ37Fyh2gjo7qxtoCjzIRAlRbR2hK9nT79BRz6ciLAtdXuNNcQThNCJxBCaQ1yTQQlMIEPUgt34tR8tRgHAQ5i00C0fuP7wD"
);

const PaymentForm = () => {
  const navigate = useNavigate();
  const { precio, idDireccion, id_producto, cantidad, setCartItems } =
    useContext(ShopContext);
  const { userlist } = useContext(FormContext);
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Opciones personalizadas para CardElement que elimina el código postal
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        "::placeholder": {
          color: "#aab7c4",
        },
        height: "40px",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    hidePostalCode: true, // Esta es la clave para eliminar el código postal
  };

  function CrearPedido() {
    if (
      id_producto &&
      cantidad &&
      id_producto.length > 0 &&
      cantidad.length > 0
    ) {
      id_producto.forEach((productoId, index) => {
        Axios.post("http://localhost:4000/CrearPedido", {
          id_user: userlist[0].id,
          id_producto: productoId,
          cantidad: cantidad[index],
          id_direccion: idDireccion,
        })
          .then((response) => {
            console.log(
              `Pedido para el producto ${productoId} creado con éxito`
            );
          })
          .catch((error) => {
            console.error(
              `Error al crear el pedido para el producto ${productoId}:`,
              error
            );
          });
      });

      console.log("Se intentaron crear todos los pedidos.");
    } else {
      console.warn("No hay productos en el carrito para crear pedidos.");
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
      setPaymentError(error.message);
      setPaymentSuccess(false);
      setProcessing(false);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      // Envía el paymentMethod.id a tu backend para procesar el pago
      try {
        const response = await Axios.post(
          "http://localhost:4000/process-payment-intent",
          {
            amount: precio * 100,
            currency: "mxn",
            paymentMethodId: paymentMethod.id,
          }
        );

        if (response.data.success) {
          setPaymentSuccess(true);
          setPaymentError(null);
          console.log("Pago exitoso:", response.data);
          CrearPedido();
          setCartItems({});

          // Redirige después de un pequeño retraso para mostrar el mensaje de éxito
          setTimeout(() => {
            navigate("/");
          }, 1500);
        } else {
          setPaymentError(response.data.error || "Error al procesar el pago.");
          setPaymentSuccess(false);
          console.error("Error en el pago:", response.data);
        }
      } catch (err) {
        setPaymentError("Ocurrió un error al comunicarse con el servidor.");
        setPaymentSuccess(false);
        console.error("Error al enviar la solicitud de pago:", err);
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <form onSubmit={handleSubmit} className="payment-form">
          <h2>Completar Pago Seguro</h2>

          {paymentError && <div className="error-message">{paymentError}</div>}
          {paymentSuccess && (
            <div className="success-message">¡Pago realizado con éxito!</div>
          )}

          <div className="payment-summary">
            <div className="payment-amount">
              <span>Total a pagar:</span>
              <strong>${precio}</strong>
            </div>
          </div>

          <div className="card-element-container">
            <label htmlFor="card-element">Información de Tarjeta</label>
            <div className="card-element-wrapper">
              <CardElement id="card-element" options={cardElementOptions} />
            </div>
          </div>

          <div className="payment-cards">
            <div className="accepted-cards">
              <span>Aceptamos:</span>
              <div className="card-icons">
                <div className="card-icon visa"></div>
                <div className="card-icon mastercard"></div>
                <div className="card-icon amex"></div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || processing}
            className={processing ? "processing" : ""}
          >
            {processing ? "Procesando..." : `Pagar $${precio}`}
          </button>

          <div className="payment-security">
            <div className="security-icon"></div>
            <p>
              Pago 100% seguro. Tu información está protegida con encriptación
              SSL de 256 bits.
            </p>
          </div>

          <div className="payment-guarantee">
            <ul>
              <li>
                Transacción procesada por Stripe, líder mundial en pagos seguros
              </li>
              <li>
                Tus datos de tarjeta nunca se almacenan en nuestros servidores
              </li>
              <li>Conexión segura y encriptada</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

const Pago = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default Pago;
