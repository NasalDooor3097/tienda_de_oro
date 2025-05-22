import { useState } from "react";
import Swal from "sweetalert2";
import "./NewsLetter.css";
const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validación básica de email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Reiniciar estados
    setError("");

    // Validar email
    if (!email.trim()) {
      setError("Por favor, ingresa tu correo electrónico");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido");
      return;
    }

    // Activar indicador de carga
    setLoading(true);

    try {
      // Simulamos procesamiento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mostrar mensaje de éxito con SweetAlert2
      Swal.fire({
        title: "¡Suscripción exitosa!",
        text: "¡Gracias por suscribirte! Te hemos enviado un correo de confirmación.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#000",
      });

      // Limpiar campo de email
      setEmail("");
    } catch (err) {
      // Error - Mostrar mensaje de error con SweetAlert2
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al procesar tu solicitud. Por favor, intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#000",
      });
      console.error("Error al procesar la suscripción:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter">
      <h1>Regístrate y consigue ofertas exclusivas</h1>
      <p>Suscríbete</p>

      <div className="newsletter-input-container">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo"
          disabled={loading}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Enviando..." : "¡Vamos 😊👌!"}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mt-3 text-sm font-medium">{error}</div>
      )}
    </div>
  );
};

export default NewsLetter;
