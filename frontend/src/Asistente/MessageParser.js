// MessageParser.js
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lower = message.toLowerCase();

    if (this.state.awaitingContactConfirmation) {
      this.actionProvider.handleUserInput(message);
      return;
    }

    if (lower.includes("hola")) {
      this.actionProvider.helloworldhandler();
    } else if (lower.includes("todos")) {
      this.actionProvider.todosHandler();
    } else if (lower.includes("contacto")) {
      this.actionProvider.redirigirContacto();
    }
    // ... otros else if para más comandos
  }
}

export default MessageParser;