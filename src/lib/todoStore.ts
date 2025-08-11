import type { Todo } from "@/types";

export const todos: Todo[] = [];

export const findById = (id: number) => todos.find((t) => t.id === id);

export const addTodo = (todo: Todo) => todos.push(todo);

export const removeById = (id: number) => {
  const i = todos.findIndex((t) => t.id === id);
  return i === -1 ? undefined : todos.splice(i, 1)[0];
};

export const getAllTodos = () => todos;
