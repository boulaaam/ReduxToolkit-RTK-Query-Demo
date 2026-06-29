import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const resolveBaseUrl = () => {
  const envBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (envBase) {
    const normalized = envBase.endsWith("/") ? envBase.slice(0, -1) : envBase;
    return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
  }

  if (typeof window !== "undefined") {
    return "/api";
  }

  return "http://localhost:3000/api";
};

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: resolveBaseUrl(),
  }),
  tagTypes: ["Weather", "Catalog", "Tasks"],
  endpoints: () => ({}),
});

export type AppApi = typeof appApi;
