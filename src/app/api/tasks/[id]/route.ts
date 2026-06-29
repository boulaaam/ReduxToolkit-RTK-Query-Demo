import { NextResponse } from "next/server";

import { toggleTask } from "@/app/api/tasks/data";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const updated = toggleTask(id);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 404 });
  }
}
