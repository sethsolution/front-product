import { TaskManager } from "@/components/task/task-manager";
import { api } from "@/lib/axios";
export default async function TasksPage() {
  
  const { data} = await api.get("/tasks/");

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 overflow-x-auto">
      <TaskManager allTasks={data} />
    </div>
  );
}
