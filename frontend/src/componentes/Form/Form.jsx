import React, { useState } from "react";
import "./Form.css";
import Axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";

const MySwal = withReactContent(Swal);

// Componente para mostrar requisitos de contraseña
const PasswordRequirement = ({ met, label }) => (
  <div className="requirement-item">
    {met ? (
      <span className="requirement-icon check">✓</span>
    ) : (
      <span className="requirement-icon">✗</span>
    )}
    <span className={met ? "requirement-text met" : "requirement-text"}>
      {label}
    </span>
  </div>
);

const Form = () => {
  // Estados principales
  const [nombre, SetNombre] = useState("");
  const [correo, SetCorreo] = useState("");
  const [password, SetPassword] = useState("");
  const navigate = useNavigate();

  // Estados adicionales para mejorar UX
  const [showPassword, setShowPassword] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    nombre: false,
    correo: false,
    password: false,
  });

  // Validaciones
  const validations = {
    nombre: nombre.length >= 4 && nombre.length <= 20,
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo),
    password: {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    },
  };

  // Función para marcar un campo como tocado
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  // Validación general de contraseña
  const isPasswordValid = Object.values(validations.password).every(Boolean);

  // Validación del formulario completo
  const isFormValid =
    validations.nombre && validations.correo && isPasswordValid;

  // Conservamos la lógica original de add
  const add = () => {
    if (!nombre || !correo || !password) {
      MySwal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Se deben completar todos los campos",
      });
    } else {
      setIsLoading(true);
      Axios.post("http://localhost:4000/Valid", {
        nombre: nombre,
        correo: correo,
      })
        .then((res) => {
          if (res.data === "fallo") {
            MySwal.fire({
              icon: "error",
              title: "Usuario ya registrado",
              text: "El usuario o el correo ya están registrados",
            });
            setIsLoading(false);
          } else {
            const longitudMinima = /.{6,}/;
            const mayuscula = /[A-Z]/;
            const minuscula = /[a-z]/;
            const numero = /\d/;
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!regex.test(correo)) {
              MySwal.fire({
                icon: "error",
                title: "Correo inválido",
                text: "El correo debe contener al menos un '@' y un dominio válido",
              });
              setIsLoading(false);
            } else if (!longitudMinima.test(password)) {
              MySwal.fire({
                icon: "info",
                title: "Contraseña corta",
                text: "La contraseña debe tener al menos 6 caracteres",
              });
              setIsLoading(false);
            } else if (!mayuscula.test(password)) {
              MySwal.fire({
                icon: "info",
                title: "Contraseña sin mayúsculas",
                text: "La contraseña debe contener al menos una letra mayúscula",
              });
              setIsLoading(false);
            } else if (!numero.test(password)) {
              MySwal.fire({
                icon: "info",
                title: "Contraseña sin números",
                text: "La contraseña debe contener al menos un número",
              });
              setIsLoading(false);
            } else if (!minuscula.test(password)) {
              MySwal.fire({
                icon: "info",
                title: "Contraseña sin minúsculas",
                text: "La contraseña debe contener al menos una letra minúscula",
              });
              setIsLoading(false);
            } else if (nombre.length > 20 || nombre.length < 4) {
              MySwal.fire({
                icon: "info",
                title: "Nombre inválido",
                text: "El nombre debe tener entre 4 y 20 caracteres",
              });
              setIsLoading(false);
            } else {
              Axios.post("http://localhost:4000/create", {
                nombre: nombre,
                correo: correo,
                password: password,
              })
                .then((respuesta) => {
                  setIsLoading(false);
                  if (respuesta.data === "fallo") {
                    MySwal.fire({
                      icon: "error",
                      title: "Registro fallido",
                      text: "Ocurrió un error al registrar el usuario.",
                    });
                  } else {
                    MySwal.fire({
                      icon: "success",
                      title: "Registro exitoso",
                      text: "El usuario fue registrado correctamente.",
                    }).then(() => {
                      navigate("/login");
                    });
                  }
                })
                .catch(() => {
                  setIsLoading(false);
                  MySwal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: "No se pudo conectar con el servidor.",
                  });
                });
            }
          }
        })
        .catch(() => {
          setIsLoading(false);
          MySwal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor.",
          });
        });
    }
  };

  return (
    <div className="Registercontainer">
      <div className="Form">
        <div className="form-header">
          <h2>Crear cuenta</h2>
          <p className="form-subtitle">
            Completa el formulario para registrarte
          </p>
        </div>

        <div className="form-body">
          {/* Campo de nombre */}
          <div className="form-field">
            <label htmlFor="nombre">Nombre de usuario</label>
            <div className="input-container">
              <input
                id="nombre"
                onChange={(event) => SetNombre(event.target.value)}
                onBlur={() => handleBlur("nombre")}
                type="text"
                placeholder="Tu nombre de usuario"
                className={
                  touched.nombre && !validations.nombre ? "input-error" : ""
                }
                required
              />
              {touched.nombre && (
                <span className="input-icon">
                  {validations.nombre ? (
                    <span className="valid-icon">✓</span>
                  ) : (
                    <span className="invalid-icon">!</span>
                  )}
                </span>
              )}
            </div>
            {touched.nombre && !validations.nombre && (
              <span className="error-message">
                El nombre debe tener entre 4 y 20 caracteres
              </span>
            )}
          </div>

          {/* Campo de correo */}
          <div className="form-field">
            <label htmlFor="correo">Correo electrónico</label>
            <div className="input-container">
              <input
                id="correo"
                onChange={(event) => SetCorreo(event.target.value)}
                onBlur={() => handleBlur("correo")}
                type="email"
                placeholder="Tu correo electrónico"
                className={
                  touched.correo && !validations.correo ? "input-error" : ""
                }
                required
              />
              {touched.correo && (
                <span className="input-icon">
                  {validations.correo ? (
                    <span className="valid-icon">✓</span>
                  ) : (
                    <span className="invalid-icon">!</span>
                  )}
                </span>
              )}
            </div>
            {touched.correo && !validations.correo && (
              <span className="error-message">
                Ingresa un correo electrónico válido
              </span>
            )}
          </div>

          {/* Campo de contraseña */}
          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <div className="input-container">
              <input
                id="password"
                onChange={(event) => SetPassword(event.target.value)}
                onBlur={() => handleBlur("password")}
                onFocus={() => setShowRequirements(true)}
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                className={
                  touched.password && !isPasswordValid ? "input-error" : ""
                }
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Requisitos de contraseña */}
            {showRequirements && (
              <div className="password-requirements">
                <p className="requirements-title">La contraseña debe tener:</p>
                <div className="requirements-list">
                  <PasswordRequirement
                    met={validations.password.length}
                    label="Al menos 6 caracteres"
                  />
                  <PasswordRequirement
                    met={validations.password.uppercase}
                    label="Una letra mayúscula"
                  />
                  <PasswordRequirement
                    met={validations.password.lowercase}
                    label="Una letra minúscula"
                  />
                  <PasswordRequirement
                    met={validations.password.number}
                    label="Un número"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botón de registro */}
          <button
            onClick={add}
            className={`submit-button ${!isFormValid ? "disabled" : ""}`}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <span className="loading-text">
                <span className="spinner"></span>
                Procesando...
              </span>
            ) : (
              "Registrarme"
            )}
          </button>

          {/* Enlace para iniciar sesión */}
          <div className="login-link">
            <span>¿Ya tienes una cuenta?</span>{" "}
            <a href="/login">Iniciar sesión</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
