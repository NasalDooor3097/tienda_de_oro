// ChatAsistente.js (simplificado)
import React from "react";
import Chatbot from "react-chatbot-kit";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";
import config from "./config";
import "react-chatbot-kit/build/main.css";
import "./ChatAsistente.css"; // 👈 Importa tu archivo CSS

const ChatAsistente = () => {
  return (
    <Chatbot // 👈 Sin div contenedor
      config={config}
      messageParser={MessageParser}
      actionProvider={ActionProvider}
    />
  );
};

export default ChatAsistente;
