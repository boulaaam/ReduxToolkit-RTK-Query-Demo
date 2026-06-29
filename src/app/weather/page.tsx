import { WeatherDashboard } from "@/features/weather/ui/WeatherDashboard";

export default function WeatherPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold text-sky-100">Weather caching strategies</h1>
        <p className="mt-2 text-sm text-slate-300">
          Explore how RTK Query caches responses per city and how middleware orchestrates storage resets when
          strategies change.
        </p>
      </div>
      <WeatherDashboard />
    </div>
  );
}
