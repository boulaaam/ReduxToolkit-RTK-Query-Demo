import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const items = Array.isArray(body?.items) ? body.items : [];

  if (items.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  return NextResponse.json(
    {
      orderId: Math.random().toString(36).slice(2, 10),
      receivedAt: new Date().toISOString(),
      itemCount: items.reduce((acc: number, item: { quantity?: number }) => acc + (item.quantity ?? 0), 0),
    },
    { status: 201 },
  );
}
