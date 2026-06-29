"use client";

import { FormEvent, useEffect, useState } from "react";

import type { TaskDto } from "@/features/tasks/api/tasksApi";
import { useAddTaskMutation, useListTasksQuery, useToggleTaskMutation } from "@/features/tasks/api/tasksApi";
import { initializeTasks, setFilter, type TaskFilter } from "@/features/tasks/model/tasksSlice";
import { selectFilteredTasks, selectTaskFilter } from "@/features/tasks/model/selectors";
import { useAppDispatch, useAppSelector } from "@/shared/lib/reduxHooks";

const filters: TaskFilter[] = ["all", "active", "completed"];

export const TasksBoard = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectTaskFilter);
  const tasks = useAppSelector(selectFilteredTasks);
  const { isLoading, isFetching } = useListTasksQuery();
  const [addTask, { isLoading: isAdding }] = useAddTaskMutation();
  const [toggleTask] = useToggleTaskMutation();
  const [draft, setDraft] = useState("");

  useEffect(() => {
    dispatch(initializeTasks());
  }, [dispatch]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) {
      return;
    }

    await addTask({ title: draft.trim() }).unwrap();
    setDraft("");
    dispatch(initializeTasks());
  };

  const handleToggle = async (id: string) => {
    await toggleTask({ id }).unwrap();
    dispatch(initializeTasks());
  };

  const handleFilterChange = (next: TaskFilter) => {
    dispatch(setFilter(next));
    dispatch(initializeTasks());
  };

  return (
    <section className="flex flex-col gap-6 rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-900/40">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-indigo-200">Tasks & Async Workflows</h2>
        <p className="text-sm text-slate-300">
          RTK Query mutations drive the API while a thunk keeps additional UI state in sync.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950/80 p-4 sm:flex-row">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a task"
          className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
        />
        <button
          type="submit"
          disabled={isAdding}
          className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-indigo-400 disabled:opacity-60"
        >
          {isAdding ? "Adding…" : "Add"}
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {filters.map((option) => (
          <button
            key={option}
            onClick={() => handleFilterChange(option)}
            className={`rounded-full border px-3 py-1 capitalize transition-colors ${
              filter === option
                ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
                : "border-slate-700 text-slate-300 hover:border-indigo-400"
            }`}
            type="button"
          >
            {option}
          </button>
        ))}
        <span className="ml-auto text-slate-400">
          {isLoading ? "Loading…" : isFetching ? "Refreshing…" : `${tasks.length} tasks`}
        </span>
      </div>

      <ul className="space-y-2">
  {tasks.map((task: TaskDto) => (
          <li
            key={task.id}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200"
          >
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.id)}
                className="size-4 rounded border border-slate-700 bg-slate-900 accent-indigo-400"
              />
              <span className={task.completed ? "line-through text-slate-500" : ""}>{task.title}</span>
            </label>
            <button
              type="button"
              onClick={() => handleToggle(task.id)}
              className="text-xs text-indigo-300 hover:text-indigo-200"
            >
              {task.completed ? "Mark active" : "Complete"}
            </button>
          </li>
        ))}
        {tasks.length === 0 && !isLoading && (
          <li className="rounded-lg border border-dashed border-slate-700 p-4 text-center text-sm text-slate-400">
            No tasks yet. Add your first above!
          </li>
        )}
      </ul>
    </section>
  );
};
