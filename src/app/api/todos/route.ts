import { NextRequest } from "next/server";
import type { Todo } from "@/types";
import { addTodo, getAllTodos } from "@/lib/todoStore";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (typeof text !== "string" || !text.trim()) {
      return new Response(
        JSON.stringify({ error: "Invalid or empty 'text' field" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const todo: Todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };

    addTodo(todo);

    return new Response(JSON.stringify(todo), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Malformed JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify(getAllTodos()), {
    headers: { "Content-Type": "application/json" },
  });
}
