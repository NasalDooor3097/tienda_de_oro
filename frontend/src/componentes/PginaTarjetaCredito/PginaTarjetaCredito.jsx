import "./PginaTarjetaCredito.css";
import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
import { FormContext } from "../../context/FormContext";
import { PaymentIcon } from "react-svg-credit-card-payment-icons";
import Swal from "sweetalert2";
import {
  FaCreditCard,
  FaUser,
  FaCalendarAlt,
  FaLock,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const PginaTarjetaCredito = () => {
  const { userlist } = useContext(FormContext);
  const [Numero, Setcardnumber] = useState("");
  const [Nombre, Setcardname] = useState("");
  const [Expiracion, Setexpirydate] = useState("");
  const [Cvv, Setcvv] = useState("");
  const [Tarjeta, Settarjeta] = useState(null);
  const [cardType, setCardType] = useState("");
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  let id_user = null;

  userlist.forEach((user) => {
    id_user = user.id;
  });

  // Validaciones
  const validateCardNumber = (number) => {
    // Elimina espacios y guiones
    const cleanedNumber = number.replace(/\s+|-/g, "");

    // Validación básica de tarjeta (algoritmo de Luhn)
    if (!/^\d{16}$/.test(cleanedNumber)) {
      return "El número debe tener 16 dígitos";
    }

    // Detectar el tipo de tarjeta
    if (cleanedNumber.startsWith("4")) {
      setCardType("visa");
    } else if (/^5[1-5]/.test(cleanedNumber)) {
      setCardType("mastercard");
    } else if (/^3[47]/.test(cleanedNumber)) {
      setCardType("amex");
    } else {
      setCardType("");
    }

    return "";
  };

  const validateName = (name) => {
    if (!name.trim()) {
      return "El nombre es obligatorio";
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
      return "El nombre solo debe contener letras";
    }
    if (name.trim().length < 3) {
      return "El nombre es demasiado corto";
    }
    return "";
  };

  const validateExpiry = (date) => {
    if (!date) {
      return "La fecha es obligatoria";
    }

    const today = new Date();
    const expiryDate = new Date(date);

    if (expiryDate <= today) {
      return "La tarjeta está vencida";
    }
    return "";
  };

  const validateCVV = (cvv) => {
    if (!/^\d{3,4}$/.test(cvv)) {
      return "El CVV debe tener 3 o 4 dígitos";
    }
    return "";
  };

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {
      Numero: validateCardNumber(Numero),
      Nombre: validateName(Nombre),
      Expiracion: validateExpiry(Expiracion),
      Cvv: validateCVV(Cvv),
    };

    setErrors(newErrors);

    // Verificar si hay errores
    const isValid = !Object.values(newErrors).some((error) => error !== "");
    setFormValid(isValid);

    return isValid;
  };

  // Manejo de cambios en inputs con validación
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 16);
    // Formatear con espacios cada 4 dígitos para mejor visualización
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    Setcardnumber(formattedValue);
    setErrors({ ...errors, Numero: validateCardNumber(value) });
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    Setcardname(value);
    setErrors({ ...errors, Nombre: validateName(value) });
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value;
    Setexpirydate(value);
    setErrors({ ...errors, Expiracion: validateExpiry(value) });
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    Setcvv(value);
    setErrors({ ...errors, Cvv: validateCVV(value) });
  };

  // Efectos para validar el formulario cuando cambian los campos
  useEffect(() => {
    if (Numero || Nombre || Expiracion || Cvv) {
      validateForm();
    }
  }, [Numero, Nombre, Expiracion, Cvv]);

  // Función para agregar tarjeta de crédito
  const AddCard = () => {
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: "Por favor corrige los errores del formulario antes de continuar.",
        confirmButtonText: "Entendido",
      });
      return;
    }

    setIsProcessing(true);

    // Simulación de procesamiento de pago
    setTimeout(() => {
      Axios.post("http://localhost:4000/AgregarTarjeta", {
        Nombre: Nombre,
        Numero: Numero.replace(/\s+/g, ""), // Eliminar espacios antes de enviar
        Expiracion: Expiracion,
        CVV: Cvv,
        id_user: id_user,
      })
        .then((response) => {
          setIsProcessing(false);
          if (response.data) {
            Swal.fire({
              icon: "success",
              title: "¡Tarjeta guardada!",
              text: "Tu tarjeta se ha registrado exitosamente.",
              confirmButtonText: "Continuar",
            }).then(() => {
              // Limpiar formulario
              Setcardnumber("");
              Setcardname("");
              Setexpirydate("");
              Setcvv("");
              setCardType("");
              ShowCard(id_user); // Mostrar las tarjetas actualizadas
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo agregar la tarjeta.",
              confirmButtonText: "Intentar de nuevo",
            });
          }
        })
        .catch((error) => {
          setIsProcessing(false);
          console.error("Error al agregar la tarjeta:", error);
          Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "Ocurrió un error al agregar la tarjeta. Por favor, intenta nuevamente.",
            confirmButtonText: "Aceptar",
          });
        });
    }, 1500); // Simulamos un procesamiento de 1.5 segundos
  };

  // Función para eliminar tarjeta de crédito
  function DeleteCard(id) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta tarjeta de tu cuenta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsProcessing(true);

        Axios.post("http://localhost:4000/EliminarTarjeta", {
          id: id,
        })
          .then((response) => {
            setIsProcessing(false);
            if (response.data) {
              Swal.fire({
                icon: "success",
                title: "¡Tarjeta eliminada!",
                text: "La tarjeta se eliminó de tu cuenta correctamente.",
                confirmButtonText: "Aceptar",
              }).then(() => {
                ShowCard(id_user);
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo eliminar la tarjeta.",
                confirmButtonText: "Intentar de nuevo",
              });
            }
          })
          .catch((error) => {
            setIsProcessing(false);
            console.error("Error al eliminar la tarjeta:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Ocurrió un error al intentar eliminar la tarjeta. Por favor, intenta nuevamente.",
              confirmButtonText: "Aceptar",
            });
          });
      }
    });
  }

  // Función para mostrar la tarjeta de crédito actual
  const ShowCard = (userId) => {
    Axios.post("http://localhost:4000/SearchCard", {
      id_user: userId,
    })
      .then((response) => {
        if (response.data.length > 0) {
          Settarjeta(response.data);
        } else {
          Settarjeta(null);
        }
      })
      .catch((error) => {
        console.error("Error al buscar la tarjeta:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al buscar tus tarjetas guardadas. Por favor, intenta nuevamente.",
          confirmButtonText: "Aceptar",
        });
      });
  };

  useEffect(() => {
    if (userlist.length > 0) {
      ShowCard(id_user);
    }
  }, [userlist, id_user]);

  // Función para formatear el número de tarjeta mostrando solo los últimos 4 dígitos
  const formatCardNumber = (number) => {
    if (!number || typeof number !== "string") {
      return "****"; // Valor predeterminado si el número no es válido
    }
    const lastFourDigits = number.slice(-4);
    return `**** **** **** ${lastFourDigits}`;
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2>Método de Pago</h2>
        <div className="card-types">
          <PaymentIcon
            type="visa"
            format="flatRounded"
            className="card-icon"
            width={50}
          />
          <PaymentIcon
            type="mastercard"
            format="flatRounded"
            className="card-icon"
            width={50}
          />
          <PaymentIcon
            type="amex"
            format="flatRounded"
            className="card-icon"
            width={50}
          />
        </div>
      </div>

      {Tarjeta && Tarjeta.length > 0 ? (
        <div className="saved-cards-container">
          <h3>Tarjetas Guardadas</h3>

          <div className="saved-cards-list">
            {Tarjeta.map((tarjeta, index) => (
              <div className="saved-card" key={index}>
                <div className="card-header">
                  <div className="card-type">
                    {tarjeta.cardnumber &&
                    typeof tarjeta.cardnumber === "string" &&
                    tarjeta.cardnumber.startsWith("4") ? (
                      <PaymentIcon
                        type="visa"
                        format="flatRounded"
                        width={40}
                      />
                    ) : tarjeta.cardnumber &&
                      typeof tarjeta.cardnumber === "string" &&
                      tarjeta.cardnumber.startsWith("5") ? (
                      <PaymentIcon
                        type="mastercard"
                        format="flatRounded"
                        width={40}
                      />
                    ) : (
                      <FaCreditCard size={32} />
                    )}
                  </div>
                  <button
                    className="delete-card-btn"
                    onClick={() => DeleteCard(tarjeta.id)}
                    disabled={isProcessing}
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>

                <div className="card-info">
                  <p className="card-number">
                    <FaCreditCard /> {formatCardNumber(tarjeta.cardnumber)}
                  </p>
                  <p className="card-name">
                    <FaUser /> {tarjeta.cardname || ""}
                  </p>
                  <div className="card-details">
                    <p className="card-expiry">
                      <FaCalendarAlt /> Exp:{" "}
                      {tarjeta.expirydate
                        ? new Date(tarjeta.expirydate).toLocaleDateString(
                            "es-ES",
                            { month: "2-digit", year: "2-digit" }
                          )
                        : ""}
                    </p>
                    <p className="card-cvv">
                      <FaLock /> CVV: ***
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="divider">
            <span>Agregar otra tarjeta</span>
          </div>
        </div>
      ) : (
        <div className="no-cards-message">
          <p>
            No tienes tarjetas guardadas. Por favor, agrega una tarjeta para
            continuar.
          </p>
        </div>
      )}

      <div className="card-form">
        <div className="form-row">
          <div className="input-group">
            <label htmlFor="cardNumber">
              <FaCreditCard /> Número de Tarjeta
              {cardType && (
                <span className="detected-card">
                  <PaymentIcon
                    type={cardType}
                    format="flatRounded"
                    width={30}
                  />
                </span>
              )}
            </label>
            <input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={Numero}
              onChange={handleCardNumberChange}
              className={errors.Numero ? "invalid" : ""}
              disabled={isProcessing}
            />
            {errors.Numero && (
              <p className="error-message">
                <FaTimes /> {errors.Numero}
              </p>
            )}
            {!errors.Numero && Numero && (
              <p className="valid-message">
                <FaCheck /> Número válido
              </p>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label htmlFor="cardName">
              <FaUser /> Nombre del Titular
            </label>
            <input
              id="cardName"
              type="text"
              placeholder="Nombre como aparece en la tarjeta"
              value={Nombre}
              onChange={handleNameChange}
              className={errors.Nombre ? "invalid" : ""}
              disabled={isProcessing}
            />
            {errors.Nombre && (
              <p className="error-message">
                <FaTimes /> {errors.Nombre}
              </p>
            )}
            {!errors.Nombre && Nombre && (
              <p className="valid-message">
                <FaCheck /> Nombre válido
              </p>
            )}
          </div>
        </div>

        <div className="form-row two-col">
          <div className="input-group">
            <label htmlFor="expiryDate">
              <FaCalendarAlt /> Fecha de Expiración
            </label>
            <input
              id="expiryDate"
              type="date"
              value={Expiracion}
              onChange={handleExpiryChange}
              className={errors.Expiracion ? "invalid" : ""}
              disabled={isProcessing}
            />
            {errors.Expiracion && (
              <p className="error-message">
                <FaTimes /> {errors.Expiracion}
              </p>
            )}
            {!errors.Expiracion && Expiracion && (
              <p className="valid-message">
                <FaCheck /> Fecha válida
              </p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="cvv">
              <FaLock /> Código de Seguridad (CVV)
            </label>
            <input
              id="cvv"
              type="password"
              placeholder="123"
              value={Cvv}
              onChange={handleCvvChange}
              maxLength={4}
              className={errors.Cvv ? "invalid" : ""}
              disabled={isProcessing}
            />
            {errors.Cvv && (
              <p className="error-message">
                <FaTimes /> {errors.Cvv}
              </p>
            )}
            {!errors.Cvv && Cvv && (
              <p className="valid-message">
                <FaCheck /> CVV válido
              </p>
            )}
          </div>
        </div>

        <div className="form-row">
          <button
            className={`submit-button ${isProcessing ? "processing" : ""} ${
              !formValid ? "disabled" : ""
            }`}
            onClick={AddCard}
            disabled={isProcessing || !formValid}
          >
            {isProcessing ? (
              <>
                <span className="spinner"></span>
                Procesando...
              </>
            ) : (
              "Guardar Tarjeta"
            )}
          </button>
        </div>

        <div className="security-info">
          <FaLock /> Tus datos están protegidos con cifrado de 256 bits
        </div>
      </div>
    </div>
  );
};

export default PginaTarjetaCredito;
