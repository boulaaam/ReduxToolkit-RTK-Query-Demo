import { NextResponse } from "next/server";

import { catalog } from "@/app/api/catalog/data";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const item = catalog.find((entry) => entry.id === id);

  if (!item) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(item, {
    headers: { "Cache-Control": "no-store" },
  });
}
