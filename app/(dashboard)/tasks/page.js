import { TaskManager } from "@/components/task/task-manager";
import { api } from "@/lib/axios";
export default async function TasksPage() {
  
  const { data} = await api.get("/tasks/");

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 overflow-x-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Gestión de Tareas</h1>
      </div>
      <TaskManager allTasks={data} />
    </div>
  );
}
