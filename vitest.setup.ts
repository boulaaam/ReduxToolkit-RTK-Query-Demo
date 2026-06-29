import "@testing-library/jest-dom/vitest";

import { server } from "@/test/server";

process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost/api";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
