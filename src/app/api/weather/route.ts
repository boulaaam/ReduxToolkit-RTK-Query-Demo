import { NextResponse } from "next/server";

import type { WeatherReport } from "@/features/weather/api/weatherApi";

const summaries = [
  "Sunny with a gentle breeze",
  "Cloudy intervals with scattered showers",
  "Warm and humid with afternoon storms",
  "Crisp skies and cool winds",
  "Calm and clear night ahead",
];

const cityOffsets: Record<string, number> = {
  "New York": 5,
  London: -2,
  Tokyo: 9,
  Sydney: 14,
  Cairo: 10,
};

const hash = (value: string) =>
  value
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

const generateWeather = (city: string, units: "metric" | "imperial"): WeatherReport => {
  const base = hash(city) + Date.now() / (1000 * 60 * 60);
  const offset = cityOffsets[city] ?? 0;
  const temperatureBase = 18 + ((base + offset) % 12);
  const humidityBase = 40 + ((base + offset) % 50);

  const temperature = units === "metric" ? temperatureBase : temperatureBase * 1.8 + 32;
  const summary = summaries[Math.abs(Math.round(base)) % summaries.length];

  return {
    city,
    temperature,
    humidity: Math.min(100, Math.round(humidityBase)),
    summary,
    updatedAt: new Date().toISOString(),
  };
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const city = url.searchParams.get("city") ?? "New York";
  const units = (url.searchParams.get("units") ?? "metric") as "metric" | "imperial";

  const report = generateWeather(city, units);
  return NextResponse.json(report, { headers: { "Cache-Control": "no-store" } });
}
