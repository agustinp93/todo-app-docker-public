"use client";
import { useState, useEffect, FormEvent } from "react";
import type { Todo } from "@/types";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  /* fetch existing items once */
  useEffect(() => {
    fetch("/api/todos")
      .then((r) => (r.ok ? r.json() : []))
      .then(setTodos)
      .catch(console.error);
  }, []);

  /* add */
  const addTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.ok) throw new Error("add failed");
      const todo: Todo = await res.json();
      setTodos((prev) => [...prev, todo]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  /* delete – calls the new DELETE handler */
  const deleteTodo = async (id: number) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("delete failed");
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">Todo List</h1>

      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New todo"
          className="flex-1 border rounded px-2 py-1"
        />
        <button type="submit" className="border rounded px-4 py-1">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((t) => (
          <li
            key={t.id}
            className="flex items-center justify-between border rounded p-2"
          >
            <div
              className={`flex-1 cursor-pointer ${
                t.completed ? "line-through opacity-60" : ""
              }`}
            >
              {t.text}
            </div>
            <button onClick={() => deleteTodo(t.id)} className="px-2">
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
