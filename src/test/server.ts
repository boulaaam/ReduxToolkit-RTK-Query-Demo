import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const weatherHandler = http.get("*/api/weather", ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const city = url.searchParams.get("city") ?? "Test City";
  return HttpResponse.json({
    city,
    summary: "Clear skies",
    temperature: 21,
    humidity: 55,
    updatedAt: new Date().toISOString(),
  });
});

const catalogHandler = http.get("*/api/catalog", () =>
  HttpResponse.json([
    {
      id: "test-item",
      name: "Test Item",
      price: 9.99,
      category: "Test",
      inventory: 10,
      description: "A demo product",
    },
  ]),
);

const checkoutHandler = http.post("*/api/checkout", () =>
  HttpResponse.json({ orderId: "order-123", receivedAt: new Date().toISOString(), itemCount: 1 }, { status: 201 }),
);

const tasksHandler = http.get("*/api/tasks", () =>
  HttpResponse.json([
    { id: "1", title: "First", completed: false },
    { id: "2", title: "Second", completed: true },
  ]),
);

export const server = setupServer(weatherHandler, catalogHandler, checkoutHandler, tasksHandler);
