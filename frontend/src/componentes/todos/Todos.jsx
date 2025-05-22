import React, { useEffect, useState } from "react";
import "./Todos.css";

const Todos = (props) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const { setState } = props;
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => {
        const fiveFirstTodos = data.slice(0, 5); // Cambiado a 5 todos
        setState((state) => ({ ...state, todos: fiveFirstTodos }));
      });
  }, []);

  const renderTodos = () => {
    return props.todos.map((todo) => {
      return (
        <li className="todos-widget-list-item" key={todo.id}>
          {" "}
          {/* Corregido a todo.id */}
          {todo.title}
        </li>
      );
    });
  };

  return (
    <div className="todos-widget">
      <ul className="todos-widget-list">{renderTodos()}</ul>
    </div>
  );
};

export default Todos;
