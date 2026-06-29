"use client";

import { useMemo, useState } from "react";

import { selectWeatherStorage } from "@/entities/preferences/model/selectors";
import { setWeatherStorage } from "@/entities/preferences/model/preferencesSlice";
import type { CacheStrategy } from "@/shared/api/storage/storageAdapters";
import { useAppDispatch, useAppSelector } from "@/shared/lib/reduxHooks";

import { useGetWeatherQuery } from "../api/weatherApi";

const cities = ["New York", "London", "Tokyo", "Sydney", "Cairo"] as const;
const unitOptions = [
  { value: "metric", label: "Metric (°C)" },
  { value: "imperial", label: "Imperial (°F)" },
] as const;

export const WeatherDashboard = () => {
  const [city, setCity] = useState<(typeof cities)[number]>("New York");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const dispatch = useAppDispatch();
  const strategy = useAppSelector(selectWeatherStorage);

  const queryArgs = useMemo(() => ({ city, units }), [city, units]);
  const { data, isFetching, isLoading, isError, error, refetch, fulfilledTimeStamp } =
    useGetWeatherQuery(queryArgs, { pollingInterval: 0 });

  const handleStrategyChange = (next: CacheStrategy) => {
    dispatch(setWeatherStorage(next));
  };

  const cacheInfo = fulfilledTimeStamp
    ? new Date(fulfilledTimeStamp).toLocaleTimeString()
    : "--";

  return (
    <section className="flex flex-col gap-6 rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-900/40">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-sky-200">The Weather Channel</h2>
        <p className="text-sm text-slate-300">
          Demonstrates a session-scoped cache that keeps data per city without leaking across browser tabs.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-200">City</span>
            <select
              className="rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
              value={city}
              onChange={(event) => setCity(event.target.value as (typeof cities)[number])}
            >
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-200">Units</span>
            <select
              className="rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
              value={units}
              onChange={(event) => setUnits(event.target.value as "metric" | "imperial")}
            >
              {unitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-200">Cache Strategy</span>
            <select
              className="rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100"
              value={strategy}
              onChange={(event) => handleStrategyChange(event.target.value as CacheStrategy)}
            >
              <option value="session">Session storage (tab only)</option>
              <option value="persistent">IndexedDB via localForage</option>
              <option value="memory">In-memory (per session)</option>
            </select>
            <span className="text-xs text-slate-400">
              Switching strategies clears cached data via middleware-controlled storage adapters.
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow hover:bg-sky-400 disabled:opacity-60"
              disabled={isFetching}
            >
              {isFetching ? "Refreshing…" : "Refetch"}
            </button>
          </div>
        </div>

        <aside className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-200">
          <h3 className="text-base font-semibold text-sky-200">Cache status</h3>
          <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
            <dt className="text-slate-400">City</dt>
            <dd>{queryArgs.city}</dd>
            <dt className="text-slate-400">Strategy</dt>
            <dd className="uppercase">{strategy}</dd>
            <dt className="text-slate-400">Last updated</dt>
            <dd>{cacheInfo}</dd>
            <dt className="text-slate-400">State</dt>
            <dd>{isLoading ? "Loading" : isFetching ? "Refreshing" : "Idle"}</dd>
          </dl>
        </aside>
      </div>

      <article className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
        {isError && (
          <p className="text-sm text-rose-300">{JSON.stringify(error)}</p>
        )}
        {!isError && data && (
          <div className="grid gap-2">
            <h3 className="text-xl font-semibold text-sky-100">{data.city}</h3>
            <p className="text-sm text-slate-300">{data.summary}</p>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="text-slate-400">Temperature</dt>
                <dd className="text-lg font-semibold text-slate-100">
                  {data.temperature.toFixed(1)}°{units === "metric" ? "C" : "F"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Humidity</dt>
                <dd className="text-lg font-semibold text-slate-100">{data.humidity}%</dd>
              </div>
            </dl>
            <p className="text-xs text-slate-400">Last refreshed {new Date(data.updatedAt).toLocaleTimeString()}.</p>
          </div>
        )}
        {!isError && !data && <p className="text-sm text-slate-300">Select a city to load weather insight.</p>}
      </article>
    </section>
  );
};
