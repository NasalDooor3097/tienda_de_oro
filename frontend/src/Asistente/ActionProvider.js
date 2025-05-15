import React from 'react';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage, stateRef, isLoggedIn) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.isLoggedIn = isLoggedIn;
  }

  // Métodos como propiedades de clase (sin function)
  setChatbotMessage = (message, delay = 1000) => {
    this.setState(prev => ({
      ...prev,
      loading: true,
    }));

    setTimeout(() => {
      this.setState(prev => ({
        ...prev,
        messages: [...prev.messages, message],
        loading: false,
      }));
    }, delay);
  };

  // ========== HANDLERS ========== //
  helloworldhandler = () => {
    const message = this.createChatBotMessage("Hello, I am Emi");
    this.setChatbotMessage(message, 800);
  };

  todosHandler = () => {
    const message = this.createChatBotMessage("Sure, here are your todos", {
      widget: "todos",
    });
    this.setChatbotMessage(message);
  };

  mostrarInfoSitio = () => {
    const message = this.createChatBotMessage(
      "Este sitio es una plataforma en línea para vender productos mexicanos al mayoreo y menudeo. Te ayudamos a crear tu tienda virtual y a alcanzar más clientes."
    );
    this.setChatbotMessage(message, 1500);
  };

  mostrarFuncionVenta = () => {
    const message = this.createChatBotMessage(
      "Puedes vender productos al mayoreo o menudeo de forma sencilla. Solo debes registrarte como vendedor, subir tus productos y comenzar a recibir pedidos."
    );
    this.setChatbotMessage(message);
  };


  mostrarRegistroVendedor = () => {
    const { texto, accion, ruta } = this.isLoggedIn
      ? {
          texto: "Administra tu cuenta de vendedor:",
          accion: "Ir a perfil",
          ruta: "/perfil"
        }
      : {
          texto: "Para vender productos necesitas:",
          accion: "Crear cuenta",
          ruta: "/register"
        };

    const message = this.createChatBotMessage(
      <div>
        {texto} <span 
          style={{
            color: '#4e8cff',
            fontWeight: 'bold',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
          onClick={() => window.location.href = ruta}
        >
          {accion}
        </span>
      </div>
    );

    this.setChatbotMessage(message);
  };
  mostrarProductosComida = () => {
    const message = this.createChatBotMessage(
      "Puedes vender artesanías, ropa, calzado, comida típica y souvenirs hasta productos de decoración, joyería y artículos de mayorista."
    );
    this.setChatbotMessage(message);
  };

  mostrarSubirProductos = () => {
    const message = this.createChatBotMessage(
      "Para subir tus productos, ve a tu perfil y selecciona 'subir tu primer producto'. Llena los detalles y haz clic en 'Subir'."
    );
    this.setChatbotMessage(message);
  };

  mostrarFormasPago = () => {
    const message = this.createChatBotMessage(
      "Aceptamos pagos por tarjeta de crédito, débito, transferencia bancaria. También puedes pagar en efectivo al recibir tu pedido."
    );
    this.setChatbotMessage(message);
  };

  mostrarEnviosInternacionales = () => {
    const message = this.createChatBotMessage(
      "Sí, realizamos envíos internacionales. Durante el proceso de compra podrás elegir el país de destino."
    );
    this.setChatbotMessage(message);
  };

  redirigirContacto = () => {
    const message = this.createChatBotMessage(
      "¿Te gustaría hablar con un agente humano por WhatsApp?",
      {
        widget: "opcionesConfirmacion",
        delay: 500
      }
    );
    
    this.setChatbotMessage(message);
    
    this.setState(prev => ({
      ...prev,
      awaitingContactConfirmation: true
    }));
  };

  handleWhatsappConfirmation = (response) => {
    const lowerResponse = response.toLowerCase().trim();
    
    this.setState(prev => ({
      ...prev,
      awaitingContactConfirmation: false
    }));

    if (lowerResponse === "sí" || lowerResponse === "si" || lowerResponse === "yes") {
      const whatsappLink = "https://wa.me/5213312345678";
      const message = this.createChatBotMessage(
        <div>
          ¡Perfecto! Contáctanos en: {" "}
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#25D366',
              fontWeight: 'bold',
              textDecoration: 'underline'
            }}
          >
            WhatsApp
          </a>
        </div>
      );
      this.setChatbotMessage(message);
    } else {
      const message = this.createChatBotMessage(
        "De acuerdo, estaré aquí si necesitas ayuda. ¡Gracias!"
      );
      this.setChatbotMessage(message);
    }
  };

  handleUserInput = (input) => {
    const lower = input.toLowerCase().trim();
    const currentState = this.stateRef?.current || {};
    
    if (currentState.awaitingContactConfirmation) {
      this.handleWhatsappConfirmation(input);
      return true;
    }
    return false;
  };
}

export default ActionProvider;