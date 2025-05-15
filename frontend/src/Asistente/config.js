import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";
import BotAvatar from "../componentes/ComponentesBotAvatar/BotAvatar";
import Todos from "../componentes/todos/Todos";
import OpcionesIniciales from "./Opciones/OpcionesIniciales";
import OpcionesMenuRapido from "./Opciones/OpcionesMenuRapido";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";

const OpcionesConfirmacion = (props) => {
  const handleResponse = (respuesta) => {
    if (props.actionProvider?.handleWhatsappConfirmation) {
      props.actionProvider.handleWhatsappConfirmation(respuesta);
    }
  };

  return (
    <div style={{ 
      marginTop: '10px', 
      display: 'flex', 
      gap: '10px',
      justifyContent: 'center'
    }}>
      <button 
        onClick={() => handleResponse("Sí")}
        style={{
          padding: '8px 20px',
          backgroundColor: '#25D366',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.3s',
          ':hover': {
            backgroundColor: '#128C7E'
          }
        }}
      >
        Sí
      </button>
      <button 
        onClick={() => handleResponse("No")}
        style={{
          padding: '8px 20px',
          backgroundColor: '#FF3B30',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.3s',
          ':hover': {
            backgroundColor: '#D70015'
          }
        }}
      >
        No
      </button>
    </div>
  );
};

const config = {
  initialMessages: [
    createChatBotMessage("¡Hola! Soy tu asistente Emi 🤖 ¿En qué puedo ayudarte hoy?", {
      widget: "opcionesIniciales"
    }),
  ],
  botName: "Chat Asistente",
  customComponents: {
    botAvatar: (props) => <BotAvatar {...props} />,
    loading: () => <div className="typing-indicator">⌛ Emi está escribiendo...</div>,
  },
  customStyles: {
    botMessageBox: {
      backgroundColor: "#efb810",
      color: "#fff",
      borderRadius: "12px",
      padding: "14px 16px",
      maxWidth: "85%",
      fontFamily: "'Segoe UI', sans-serif",
      fontSize: "16px",
      marginBottom: "8px",
    },
    userMessageBox: {
      backgroundColor: "#4e8cff",
      color: "#fff",
      borderRadius: "12px",
      padding: "14px 16px",
      maxWidth: "85%",
      fontFamily: "'Segoe UI', sans-serif",
      fontSize: "16px",
      marginBottom: "8px",
    },
    chatButton: {
      backgroundColor: "#efb810",
      borderRadius: "50%",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      width: "56px",
      height: "56px",
      hoverBackground: "#d6a20e",
    },
  },
  state: {
    todos: [],
    awaitingContactConfirmation: false,
  },
  widgets: [
    {
      widgetName: "todos",
      widgetFunc: (props) => <Todos {...props} />,
      mapStateToProps: ["todos"],
    },
    {
      widgetName: "opcionesIniciales",
      widgetFunc: (props) => <OpcionesIniciales {...props} />,
    },
    {
      widgetName: "menuRapido",
      widgetFunc: (props) => <OpcionesMenuRapido {...props} />,
    },
    {
      widgetName: "opcionesConfirmacion",
      widgetFunc: (props) => <OpcionesConfirmacion {...props} />,
    }
  ],
  actionProvider: ActionProvider,
  messageParser: MessageParser
};

export default config;