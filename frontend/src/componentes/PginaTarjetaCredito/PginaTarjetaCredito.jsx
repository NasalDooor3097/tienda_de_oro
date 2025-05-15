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
} from "react-icons/fa";
const PginaTarjetaCredito = () => {
    const { userlist } = useContext(FormContext);
    const [Numero, Setcardnumber] = useState("");
    const [Nombre, Setcardname] = useState("");
    const [Expiracion, Setexpirydate] = useState("");
    const [Cvv, Setcvv] = useState("");
    const [Tarjeta, Settarjeta] = useState(null);
    let id_user = null;

    userlist.forEach((user) => {
        id_user = user.id;
    });

    // Función para agregar tarjeta de crédito
const AddCard = () => {
  Axios.post("http://localhost:4000/AgregarTarjeta", {
    Nombre: Nombre,
    Numero: Numero,
    Expiracion: Expiracion,
    CVV: Cvv,
    id_user: id_user,
  })
    .then((response) => {
      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Se agregó la tarjeta exitosamente.",
          confirmButtonText: "Aceptar",
        }).then(() => {
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
      console.error("Error al agregar la tarjeta:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al agregar la tarjeta. Por favor, intenta nuevamente.",
        confirmButtonText: "Aceptar",
      });
    });
};
    // Función para eliminar tarjeta de crédito

function DeleteCard(id) {
  Axios.post("http://localhost:4000/EliminarTarjeta", {
    id: id, 
  })
    .then((response) => {
      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "La tarjeta se eliminó exitosamente.",
          confirmButtonText: "Aceptar",
        }).then(() => {
          window.location.reload()
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
      console.error("Error al eliminar la tarjeta:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar eliminar la tarjeta. Por favor, intenta nuevamente.",
        confirmButtonText: "Aceptar",
      });
    });
};
    // Función para mostrar la tarjeta de crédito actual

const ShowCard = (userId) => {
  Axios.post("http://localhost:4000/SearchCard", {
    id_user: userId,
  })
    .then((response) => {
      if (response.data.length > 0) {
        Settarjeta(response.data);
        console.log(response.data);
      } else {
        Swal.fire({
          icon: "info",
          title: "Sin tarjetas",
          text: "No existen tarjetas asociadas a este usuario.",
          confirmButtonText: "Aceptar",
        }).then(() => {
          Settarjeta(null); 
        });
      }
    })
    .catch((error) => {
      console.error("Error al buscar la tarjeta:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al buscar la tarjeta. Por favor, intenta nuevamente.",
        confirmButtonText: "Aceptar",
      });
    });
};
    useEffect(() => {
        if (userlist.length > 0) {
            ShowCard(id_user);
        }
    }, [userlist, id_user]);

    return (
      <div className="container-tarjeta">
        <div className="titulo-tarjeta">
          <h2>Tarjeta de Crédito/débito</h2>
          <PaymentIcon
            type="visa"
            format="flatRounded"
            className="crecer"
            width={50}
          />
          <PaymentIcon
            type="mastercard"
            format="flatRounded"
            className="crecer"
            width={50}
          />
        </div>

        {Tarjeta ? (
          <div className="tarjeta">
          {Tarjeta.map((tarjeta, index) => (
            <div className="tarjeta" key={index}>
              <p>
                <strong>
                  <FaCreditCard /> Número de Tarjeta:
                </strong>{" "}
                {tarjeta.cardnumber}
              </p>
              <p>
                <strong>
                  <FaUser /> Nombre:
                </strong>{" "}
                {tarjeta.cardname}
              </p>
              <p>
                <strong>
                  <FaCalendarAlt /> Expiración:
                </strong>{" "}
                {tarjeta.expirydate}
              </p>
              <p>
                <strong>
                  <FaLock /> CVV:
                </strong>{" "}
                {tarjeta.cvv}
              </p>
              <button className="btn-eliminar" onClick={() => DeleteCard(tarjeta.id)}>
                Eliminar Tarjeta
              </button>
            </div>
          ))}

            <h1>Agregar otra tarjeta</h1>


            <div className="agregar-tarjeta">
              <label htmlFor="">Numero tarjeta</label>
            <input
              type="text"
              placeholder="0000-0000-0000-0000"
              value={Numero}
              onChange={(e) => Setcardnumber(e.target.value)}
              maxLength={16}
              pattern="^\d{16}$"
              required
            />
              <label htmlFor="">Nombre:</label>
            <input
              type="text"
              placeholder="Nombre"
              value={Nombre}
              onChange={(e) => Setcardname(e.target.value)}
              required
              />
              <label htmlFor="">Fecha expiracion:</label>
            <input
              type="date"
              placeholder="Fecha de Expiración"
              value={Expiracion}
              onChange={(e) => Setexpirydate(e.target.value)}
              id="expirydate"
              required
              />
              <label htmlFor="">CVV</label>
            <input
              type="text"
              maxLength={4}
              pattern="^\d{4}$"
              placeholder="000"
              value={Cvv}
              onChange={(e) => Setcvv(e.target.value)}
              required
            />
            <button className="btn-agregar" onClick={AddCard}>
              Agregar Tarjeta
            </button>
          </div>


          </div>
        ) : (
            <div className="agregar-tarjeta">
              <label htmlFor="">Numero tarjeta</label>
            <input
              type="text"
              placeholder="0000-0000-0000-0000"
              value={Numero}
              onChange={(e) => Setcardnumber(e.target.value)}
              maxLength={16}
              pattern="^\d{16}$"
              required
            />
              <label htmlFor="">Nombre:</label>
            <input
              type="text"
              placeholder="Nombre"
              value={Nombre}
              onChange={(e) => Setcardname(e.target.value)}
              required
              />
              <label htmlFor="">Fecha expiracion:</label>
            <input
              type="date"
              placeholder="Fecha de Expiración"
              value={Expiracion}
              onChange={(e) => Setexpirydate(e.target.value)}
              id="expirydate"
              required
              />
              <label htmlFor="">CVV</label>
            <input
              type="text"
              maxLength={4}
              pattern="^\d{4}$"
              placeholder="000"
              value={Cvv}
              onChange={(e) => Setcvv(e.target.value)}
              required
            />
            <button className="btn-agregar" onClick={AddCard}>
              Agregar Tarjeta
            </button>
          </div>
        )}
      </div>
    );
};

export default PginaTarjetaCredito;
