import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store";
import type { TaskDto } from "@/features/tasks/api/tasksApi";
import { tasksApi } from "@/features/tasks/api/tasksApi";

export const selectTasksState = (state: RootState) => state.tasks;

export const selectTaskFilter = (state: RootState) => state.tasks.filter;

const selectTasksQuery = tasksApi.endpoints.listTasks.select(undefined);

export const selectFilteredTasks = createSelector(
  selectTasksQuery,
  selectTaskFilter,
  (
    queryState: ReturnType<typeof selectTasksQuery>,
    filter: ReturnType<typeof selectTaskFilter>,
  ): TaskDto[] => {
    const data = (queryState.data ?? []) as TaskDto[];

    if (filter === "active") {
      return data.filter((task: TaskDto) => !task.completed);
    }

    if (filter === "completed") {
      return data.filter((task: TaskDto) => task.completed);
    }

    return data;
  },
);
