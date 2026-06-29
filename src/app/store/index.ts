import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { preferencesReducer } from "@/entities/preferences/model/preferencesSlice";
import { cartReducer } from "@/features/cart/model/cartSlice";
import { tasksReducer } from "@/features/tasks/model/tasksSlice";
import { appApi } from "@/shared/api/appApi";

import { storageControlMiddleware } from "./middleware/storageControlMiddleware";

export const createAppStore = () =>
  configureStore({
    reducer: {
      [appApi.reducerPath]: appApi.reducer,
      preferences: preferencesReducer,
      cart: cartReducer,
      tasks: tasksReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        appApi.middleware,
        storageControlMiddleware,
      ),
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const store = createAppStore();

setupListeners(store.dispatch);
