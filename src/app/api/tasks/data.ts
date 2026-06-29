import { nanoid } from "nanoid";

import type { TaskDto } from "@/features/tasks/api/tasksApi";

const seed: TaskDto[] = [
  { id: nanoid(6), title: "Review PRs", completed: false },
  { id: nanoid(6), title: "Refine weather endpoint", completed: true },
  { id: nanoid(6), title: "Plan UX research", completed: false },
];

const tasks: TaskDto[] = [...seed];

export const listTasks = () => tasks;

export const addTask = (title: string) => {
  const next: TaskDto = { id: nanoid(6), title, completed: false };
  tasks.push(next);
  return next;
};

export const toggleTask = (id: string) => {
  const task = tasks.find((entry) => entry.id === id);
  if (!task) {
    throw new Error("Task not found");
  }
  task.completed = !task.completed;
  return task;
};
