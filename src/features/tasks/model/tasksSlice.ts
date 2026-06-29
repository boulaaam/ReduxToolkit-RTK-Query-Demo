import {
  createAsyncThunk,
  createSlice,
  type ActionReducerMapBuilder,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { RootState } from "@/app/store";
import { tasksApi } from "@/features/tasks/api/tasksApi";
import type { TaskDto } from "@/features/tasks/api/tasksApi";

export type TaskFilter = "all" | "active" | "completed";

export interface TasksState {
  status: "idle" | "loading" | "failed";
  error?: string;
  filter: TaskFilter;
  lastSyncedAt?: number;
}

const initialState: TasksState = {
  status: "idle",
  filter: "all",
};

export const initializeTasks = createAsyncThunk<TaskDto[], void, { state: RootState }>(
  "tasks/initialize",
  async (_, thunkApi) => {
    const promise = thunkApi.dispatch(
      tasksApi.endpoints.listTasks.initiate(undefined, { forceRefetch: true }),
    );
    const { data = [] } = await promise;
    return data;
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilter(state: TasksState, action: PayloadAction<TaskFilter>) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<TasksState>) => {
    builder
      .addCase(initializeTasks.pending, (state: TasksState) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(initializeTasks.fulfilled, (state: TasksState) => {
        state.status = "idle";
        state.lastSyncedAt = Date.now();
      })
      .addCase(initializeTasks.rejected, (state: TasksState, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addMatcher(tasksApi.endpoints.addTask.matchFulfilled, (state: TasksState) => {
        state.lastSyncedAt = Date.now();
      })
      .addMatcher(tasksApi.endpoints.toggleTask.matchFulfilled, (state: TasksState) => {
        state.lastSyncedAt = Date.now();
      });
  },
});

export const { setFilter } = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
