import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import type { RootState } from "@/app/store";
import { selectWeatherStorage } from "@/entities/preferences/model/selectors";
import { appApi } from "@/shared/api/appApi";
import { buildStorageBackedQuery } from "@/shared/api/createStorageBackedQuery";

export interface WeatherQueryArgs {
  city: string;
  units: "metric" | "imperial";
}

export interface WeatherReport {
  city: string;
  summary: string;
  temperature: number;
  humidity: number;
  updatedAt: string;
}

type WeatherEndpointBuilder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  "Weather" | "Catalog" | "Tasks",
  "appApi"
>;

export const weatherApi = appApi.injectEndpoints({
  endpoints: (builder: WeatherEndpointBuilder) => ({
    getWeather: buildStorageBackedQuery<WeatherReport, WeatherQueryArgs>(builder, {
      query: ({ city, units }: WeatherQueryArgs) => ({
        url: "/weather",
        params: { city, units },
      }),
      storage: {
        strategy: ({ getState, arg }) =>
          selectWeatherStorage(getState() as RootState) ?? (arg.units === "metric" ? "session" : "persistent"),
        key: ({ city, units }) => `weather:${city}:${units}`,
        ttlMs: 1000 * 60 * 10,
        purgeOnCacheRemoval: true,
      },
      providesTags: (result: WeatherReport | undefined) => [
        { type: "Weather", id: result?.city ?? "weather" },
      ],
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: false,
});

export const { useGetWeatherQuery } = weatherApi;
