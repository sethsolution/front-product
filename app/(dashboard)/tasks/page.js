import { TaskManager } from "@/components/task/task-manager";
import { api } from "@/lib/axios";
export default async function TasksPage() {
  // const resp = await fetch("http://localhost:8000/tasks/", {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

  // const data = await resp.json();
  const { data} = await api.get("/tasks/");

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 overflow-x-auto">
      <TaskManager allTasks={data} />
    </div>
  );
}
