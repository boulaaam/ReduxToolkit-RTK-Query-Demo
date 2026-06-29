import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { appApi } from "@/shared/api/appApi";
import { buildStorageBackedQuery } from "@/shared/api/createStorageBackedQuery";

export interface TaskDto {
  id: string;
  title: string;
  completed: boolean;
}

type AppEndpointBuilder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  "Weather" | "Catalog" | "Tasks",
  "appApi"
>;

export const tasksApi = appApi.injectEndpoints({
  endpoints: (builder: AppEndpointBuilder) => ({
    listTasks: buildStorageBackedQuery<TaskDto[], void>(builder, {
      query: () => ({ url: "/tasks" }),
      storage: {
        strategy: "memory",
        key: "tasks",
        ttlMs: 1000 * 30,
      },
  providesTags: (result: TaskDto[] | undefined) =>
        result
          ? ["Tasks", ...result.map((task: TaskDto) => ({ type: "Tasks" as const, id: task.id }))]
          : ["Tasks"],
    }),
    addTask: builder.mutation<TaskDto, Pick<TaskDto, "title">>({
      query: (payload: Pick<TaskDto, "title">) => ({
        url: "/tasks",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Tasks"],
    }),
    toggleTask: builder.mutation<TaskDto, { id: string }>({
      query: ({ id }: { id: string }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result: TaskDto | undefined, _error: unknown, arg: { id: string }) => [
        { type: "Tasks", id: arg.id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useListTasksQuery, useAddTaskMutation, useToggleTaskMutation } = tasksApi;
