import { NextResponse } from "next/server";

import { addTask, listTasks } from "@/app/api/tasks/data";

export async function GET() {
  return NextResponse.json(listTasks(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const body = await request.json();
  const title: string | undefined = body?.title;

  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  const task = addTask(title);
  return NextResponse.json(task, { status: 201 });
}
