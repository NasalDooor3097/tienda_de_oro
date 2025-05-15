import Axios from "axios";
import "./Direcciones.css";
import React, { useState, useContext, useEffect } from "react";
import { FormContext } from "../../context/FormContext";

const Direcciones = () => {
  const { userlist } = useContext(FormContext);
  const user = userlist[0];
  console.log(user.id);

  const [direccion, setDireccion] = useState({
    id_user: user.id,
    calle: "",
    numero_exterior: "",
    colonia: "",
    ciudad: "",
    estado: "",
    codigo_postal: "",
    vivienda: "Casa",
    numero_departamento: "Nulo"
  });

  const [direccionesGuardadas, setDireccionesGuardadas] = useState([]);

  const handleChange = (e) => {
    setDireccion({
      ...direccion,
      [e.target.name]: e.target.value
    });
  };

  const Guardar = async () => {
    if (!direccion.calle || !direccion.numero_exterior || !direccion.colonia || 
        !direccion.ciudad || !direccion.estado || !direccion.codigo_postal) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }

    try {
      await Axios.post("http://localhost:4000/GuardarDireccion", direccion);
      alert("Dirección guardada exitosamente");
      
      setDireccion({
        id_user: user.id,
        calle: "",
        numero_exterior: "",
        colonia: "",
        ciudad: "",
        estado: "",
        codigo_postal: "",
        vivienda: "Casa",
        numero_departamento: "Nulo"
      });

      

    } catch (error) {
      console.error("Error al guardar dirección:", error);
      alert("Error al guardar dirección: " + (error.response?.data?.message || error.message));
    }
  };

  
    useEffect(() => {
        if (user && user.id) {
            Axios.post("http://localhost:4000/BuscarDirecciones", {
                id_user: user.id
            }).then((response) => {
                if (response.data.length === 0) {
                    alert("No hay direcciones guardadas");
                } else {
                    setDireccionesGuardadas(response.data);
                }
            }).catch((error) => {
                console.error("Error al buscar direcciones:", error);
                alert("Error al buscar direcciones: " + (error.response?.data?.message || error.message));
            });
        }
    }, [user])

  

  return (
    <div className="direccion-container">
      {/* Formulario */}
      <div className="input-group">
        <label>
          Calle:
          <input type="text" name="calle" value={direccion.calle} onChange={handleChange} required />
        </label>
      </div>
      <div className="input-group">
        <label>
          Número Exterior:
          <input type="text" name="numero_exterior" value={direccion.numero_exterior} onChange={handleChange} required />
        </label>
      </div>
      <div className="input-group">
        <label>
          Colonia:
          <input type="text" name="colonia" value={direccion.colonia} onChange={handleChange} required />
        </label>
      </div>
      <div className="input-group">
        <label>
          Ciudad:
          <input type="text" name="ciudad" value={direccion.ciudad} onChange={handleChange} required />
        </label>
      </div>
      <div className="input-group">
        <label>
          Estado:
          <input type="text" name="estado" value={direccion.estado} onChange={handleChange} required />
        </label>
      </div>
      <div className="input-group">
        <label>
          Código Postal:
          <input type="text" name="codigo_postal" value={direccion.codigo_postal} onChange={handleChange} required />
        </label>
      </div>
      <div className="input-group">
        <label>
          Tipo de Vivienda:
          <select name="vivienda" value={direccion.vivienda} onChange={handleChange}>
            <option value="Casa">Casa</option>
            <option value="Departamento">Departamento</option>
          </select>
        </label>
      </div>
      {direccion.vivienda === "Departamento" && (
        <div className="input-group">
          <label>
            Número de Apartamento:
            <input type="text" name="numero_departamento" value={direccion.numero_departamento} onChange={handleChange} required />
          </label>
        </div>
      )}
      <button className="guardar-btn" onClick={Guardar}>Guardar Dirección</button>

      
      <div className="lista-direcciones">
        <h3>Direcciones Guardadas:</h3>


        {direccionesGuardadas.length > 0 ? (
          direccionesGuardadas.map((dir, index) => (
            <div key={index} className="tarjeta-direccion">
              <p><strong>Calle:</strong> {dir.calle}</p>
              <p><strong>Número Exterior:</strong> {dir.numero_exterior}</p>
              <p><strong>Colonia:</strong> {dir.colonia}</p>
              <p><strong>Ciudad:</strong> {dir.ciudad}</p>
              <p><strong>Estado:</strong> {dir.estado}</p>
              <p><strong>Código Postal:</strong> {dir.codigo_postal}</p>
              <p><strong>Tipo de Vivienda:</strong> {dir.vivienda}</p>
              <p><strong>Número de Departamento:</strong> {dir.numero_departamento}</p>
              <br />
            </div>
            
          ))
        ) : (
          <p>No hay direcciones guardadas.</p>
        )}

      </div>
    </div>
  );
};

export default Direcciones;