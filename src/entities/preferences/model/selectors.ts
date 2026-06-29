import type { RootState } from "@/app/store";

export const selectPreferences = (state: RootState) => state.preferences;
export const selectWeatherStorage = (state: RootState) => state.preferences.weatherStorage;
export const selectCatalogStorage = (state: RootState) => state.preferences.catalogStorage;
