import Axios from "axios";
import "./Direcciones.css";
import React, { useState, useContext, useEffect } from "react";
import { FormContext } from "../../context/FormContext";
import Swal from "sweetalert2";

const Direcciones = () => {
  const { userlist } = useContext(FormContext);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Verificación segura del usuario
  const user = userlist?.[0] || {};
  const userId = user?.id;

  const [direccion, setDireccion] = useState({
    id_user: userId,
    calle: "",
    numero_exterior: "",
    colonia: "",
    ciudad: "",
    estado: "",
    codigo_postal: "",
    vivienda: "Casa",
    numero_departamento: "Nulo",
  });

  const [direccionesGuardadas, setDireccionesGuardadas] = useState([]);

  // Validación mejorada de campos
  const validateFields = () => {
    const newErrors = {};
    const requiredFields = [
      "calle",
      "numero_exterior",
      "colonia",
      "ciudad",
      "estado",
      "codigo_postal",
    ];

    requiredFields.forEach((field) => {
      if (!direccion[field]?.trim()) {
        newErrors[field] = "Este campo es requerido";
      }
    });

    // Validación específica para código postal
    if (direccion.codigo_postal && !/^\d{5}$/.test(direccion.codigo_postal)) {
      newErrors.codigo_postal = "Código postal inválido (5 dígitos requeridos)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDireccion({
      ...direccion,
      [name]: value,
    });

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const Guardar = async () => {
    if (!validateFields()) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor complete todos los campos requeridos correctamente",
        confirmButtonColor: "#3498db",
      });
      return;
    }

    setLoading(true);

    try {
      await Axios.post("http://localhost:4000/GuardarDireccion", direccion);

      await Swal.fire({
        icon: "success",
        title: "¡Dirección guardada!",
        text: "La dirección se ha registrado correctamente",
        confirmButtonColor: "#3498db",
        timer: 2000,
        timerProgressBar: true,
      });

      // Resetear formulario
      setDireccion({
        id_user: userId,
        calle: "",
        numero_exterior: "",
        colonia: "",
        ciudad: "",
        estado: "",
        codigo_postal: "",
        vivienda: "Casa",
        numero_departamento: "Nulo",
      });

      // Recargar direcciones
      cargarDirecciones();
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Ocurrió un error al guardar la dirección",
        confirmButtonColor: "#3498db",
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarDirecciones = async () => {
    if (!userId) return;

    try {
      const response = await Axios.post(
        "http://localhost:4000/BuscarDirecciones",
        {
          id_user: userId,
        }
      );
      setDireccionesGuardadas(response.data || []);
    } catch (error) {
      console.error("Error al cargar direcciones:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No hay direcciones guardadas",
        confirmButtonColor: "#3498db",
      });
    }
  };

  useEffect(() => {
    if (userId) {
      cargarDirecciones();
    }
  }, [userId]);

  if (!userId) {
    return (
      <div className="error-usuario">
        <h3>No se encontró información de usuario</h3>
        <p>Por favor inicie sesión nuevamente</p>
      </div>
    );
  }

  return (
    <div className="direcciones-app">
      <h2 className="titulo-seccion">Gestión de Direcciones</h2>

      <div className="direcciones-contenedor">
        {/* Formulario */}
        <div className="formulario-direccion">
          <h3>Agregar Nueva Dirección</h3>

          <div className="form-grid">
            {[
              {
                name: "calle",
                label: "Calle*",
                placeholder: "Ej. Av. Principal",
              },
              {
                name: "numero_exterior",
                label: "Número Exterior*",
                placeholder: "Ej. 123",
              },
              { name: "colonia", label: "Colonia*", placeholder: "Ej. Centro" },
              {
                name: "ciudad",
                label: "Ciudad*",
                placeholder: "Ej. Ciudad de México",
              },
              { name: "estado", label: "Estado*", placeholder: "Ej. CDMX" },
              {
                name: "codigo_postal",
                label: "Código Postal*",
                placeholder: "Ej. 12345",
                maxLength: 5,
              },
            ].map((field) => (
              <div key={field.name} className="form-group">
                <label>{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={direccion[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  className={errors[field.name] ? "error" : ""}
                />
                {errors[field.name] && (
                  <span className="error-message">{errors[field.name]}</span>
                )}
              </div>
            ))}

            <div className="form-group">
              <label>Tipo de Vivienda</label>
              <select
                name="vivienda"
                value={direccion.vivienda}
                onChange={handleChange}
              >
                <option value="Casa">Casa</option>
                <option value="Departamento">Departamento</option>
              </select>
            </div>

            {direccion.vivienda === "Departamento" && (
              <div className="form-group">
                <label>Número de Apartamento*</label>
                <input
                  type="text"
                  name="numero_departamento"
                  value={direccion.numero_departamento}
                  onChange={handleChange}
                  placeholder="Ej. 12B"
                  className={errors.numero_departamento ? "error" : ""}
                />
                {errors.numero_departamento && (
                  <span className="error-message">
                    {errors.numero_departamento}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            className="boton-primario"
            onClick={Guardar}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Guardando...
              </>
            ) : (
              "Guardar Dirección"
            )}
          </button>
        </div>

        {/* Lista de direcciones */}
        <div className="lista-direcciones">
          <h3>Mis Direcciones Guardadas</h3>

          {direccionesGuardadas.length > 0 ? (
            <div className="grid-direcciones">
              {direccionesGuardadas.map((dir) => (
                <div key={dir.id} className="tarjeta-direccion">
               
                  <div className="tarjeta-header">
                    <span className="badge-vivienda">{dir.vivienda}</span>
                    {dir.vivienda === "Departamento" && (
                      <span className="badge-departamento">
                        Apto: {dir.numero_departamento}
                      </span>
                    )}
                  </div>
                  <div className="tarjeta-body">
                    <p>
                      <span className="etiqueta">Dirección:</span> {dir.calle} #
                      {dir.numero_exterior}
                    </p>
                    <p>
                      <span className="etiqueta">Colonia:</span> {dir.colonia}
                    </p>
                    <p>
                      <span className="etiqueta">Ciudad:</span> {dir.ciudad},{" "}
                      {dir.estado}
                    </p>
                    <p>
                      <span className="etiqueta">C.P.:</span>{" "}
                      {dir.codigo_postal}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="sin-direcciones">
              <p>No hay direcciones guardadas</p>
              <p>Agrega una nueva dirección usando el formulario</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Direcciones;
