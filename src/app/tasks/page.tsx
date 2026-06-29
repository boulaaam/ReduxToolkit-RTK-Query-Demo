import { TasksBoard } from "@/features/tasks/ui/TasksBoard";

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold text-indigo-100">Task operations with thunks</h1>
        <p className="mt-2 text-sm text-slate-300">
          Combine RTK Query mutations with classic reducers and a coordinating thunk that prefetches fresh
          data whenever the UI triggers a change.
        </p>
      </div>
      <TasksBoard />
    </div>
  );
}
