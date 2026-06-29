import type { Middleware } from "@reduxjs/toolkit";

import type { PreferencesState } from "@/entities/preferences/model/preferencesSlice";
import {
  resetPreferences,
  setCatalogStorage,
  setWeatherStorage,
} from "@/entities/preferences/model/preferencesSlice";
import { appApi } from "@/shared/api/appApi";
import { createStorageAdapter } from "@/shared/api/storage/storageAdapters";

type RootState = {
  preferences: PreferencesState;
};

type TagType = "Weather" | "Catalog" | "Tasks";

type AppMiddleware = Middleware<object, RootState>;

export const storageControlMiddleware: AppMiddleware =
  (storeApi) => (next) => (action) => {
    const previous = storeApi.getState().preferences;
    const result = next(action);
    const current = storeApi.getState().preferences;

    const clearAndInvalidate = (
      tag: TagType,
      strategies: Array<"session" | "persistent" | "memory">,
    ) => {
      void (async () => {
        await Promise.all(strategies.map((strategy) => createStorageAdapter(strategy).clear()));
        storeApi.dispatch(appApi.util.invalidateTags([tag]));
      })();
    };

    if (setWeatherStorage.match(action) && previous.weatherStorage !== current.weatherStorage) {
      clearAndInvalidate("Weather", [previous.weatherStorage, current.weatherStorage]);
    }

    if (setCatalogStorage.match(action) && previous.catalogStorage !== current.catalogStorage) {
      clearAndInvalidate("Catalog", [previous.catalogStorage, current.catalogStorage]);
    }

    if (resetPreferences.match(action)) {
      clearAndInvalidate("Weather", [previous.weatherStorage, "session"]);
      clearAndInvalidate("Catalog", [previous.catalogStorage, "persistent"]);
    }

    return result;
  };
