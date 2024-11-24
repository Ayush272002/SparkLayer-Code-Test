import React, { useEffect, useState } from "react";
import "./App.css";
import Todo, { TodoType } from "./Todo";

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:8080/");
        if (response.status !== 200) {
          console.log("Error fetching data");
          return;
        }
        const data = await response.json();
        setTodos(data || []);
      } catch (e) {
        console.log("Could not connect to server. Ensure it is running. " + e);
      }
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });
      if (response.status !== 200) {
        console.log("Error adding todo");
        return;
      }
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setTitle("");
      setDescription("");
    } catch (e) {
      console.log("Could not connect to server. Ensure it is running. " + e);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos.map((todo) => (
          <Todo
            key={todo.title + todo.description}
            title={todo.title}
            description={todo.description}
          />
        ))}
      </div>

      <h2>Add a Todo</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus={true}
        />
        <input
          placeholder="Description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

export default App;
