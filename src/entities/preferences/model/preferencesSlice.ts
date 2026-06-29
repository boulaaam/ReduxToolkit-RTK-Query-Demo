import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CacheStrategy } from "@/shared/api/storage/storageAdapters";

export interface PreferencesState {
  weatherStorage: CacheStrategy;
  catalogStorage: CacheStrategy;
}

const initialState: PreferencesState = {
  weatherStorage: "session",
  catalogStorage: "persistent",
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setWeatherStorage(state: PreferencesState, action: PayloadAction<CacheStrategy>) {
      state.weatherStorage = action.payload;
    },
    setCatalogStorage(state: PreferencesState, action: PayloadAction<CacheStrategy>) {
      state.catalogStorage = action.payload;
    },
    resetPreferences() {
      return initialState;
    },
  },
});

export const { setWeatherStorage, setCatalogStorage, resetPreferences } = preferencesSlice.actions;

export const preferencesReducer = preferencesSlice.reducer;
