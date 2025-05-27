"use client";

import { useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { PlusCircle, Search, Filter } from "lucide-react";
import { TaskTable } from "@/components/task/task-table";
import { TaskForm } from "@/components/task/task-form";
import { TaskDetails } from "@/components/task/task-details";
import { DeleteConfirmation } from "@/components/ui/delete-confirmation";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";

export function TaskManager({ allTasks }) {
  const [tasks, setTasks] = useState(allTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  const filterOptions = [
    { value: "all", label: "Buscar en todo" },
    { value: "title", label: "Buscar por título" },
    { value: "description", label: "Buscar por descripción" },
    { value: "date", label: "Buscar por fecha" },
    { value: "status", label: "Buscar por estado" },
  ];

  const filteredTasks = tasks.filter((task) => {
    if (!searchTerm.trim()) return true;

    const search = searchTerm.toLowerCase().trim();

    switch (filterBy) {
      case "title":
        return task.title?.toLowerCase().includes(search);

      case "description":
        return task.description?.toLowerCase().includes(search);

      case "date":
        const formatDate = (dateString) => {
          if (!dateString) return "";
          try {
            return format(new Date(dateString), "dd MMM yyyy, HH:mm", {
              locale: es,
            });
          } catch {
            return "";
          }
        };
        const createdDate = formatDate(task.created_at);
        const updatedDate = formatDate(task.updated_at);
        return (
          createdDate.toLowerCase().includes(search) ||
          updatedDate.toLowerCase().includes(search)
        );

      case "status":
        const statusText = task.completed ? "completado" : "pendiente";
        return statusText.includes(search);

      case "all":
      default:
        const createdDateAll = task.createdAt
          ? new Date(task.createdAt).toLocaleDateString("es-ES")
          : "";
        const updatedDateAll = task.updatedAt
          ? new Date(task.updatedAt).toLocaleDateString("es-ES")
          : "";
        const statusTextAll = task.completed ? "completado" : "pendiente";

        return (
          task.title?.toLowerCase().includes(search) ||
          task.description?.toLowerCase().includes(search) ||
          createdDateAll.includes(search) ||
          updatedDateAll.includes(search) ||
          statusTextAll.includes(search)
        );
    }
  });

  const handleCreateTask = async (newTask) => {
    try {
      const { data: createdTask } = await api.post(`/tasks/`, newTask);
      toast.success("Tarea creada con éxito!");
      setTasks((prev) => [...prev, createdTask]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creando la tarea:", error);
      toast.error("Algo salió mal :(");
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const { data: updated } = await api.patch(
        `/tasks/${updatedTask.id}`,
        updatedTask
      );
      toast.success("Tarea actualizada con éxito!");
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updated : task))
      );
      setIsFormOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error editando la tarea:", error);
      toast.error("Algo salió mal :(");
    }
  };

  const handleDeleteTask = async () => {
    try {
      if (currentTask) {
        await api.delete(`/tasks/${currentTask.id}`);
        toast.success("Tarea eliminada con exito!");
        setTasks((prev) => prev.filter((task) => task.id !== currentTask.id));
        setIsDeleteOpen(false);
        setCurrentTask(null);
      }
    } catch (error) {
      console.error("Error eliminando la tarea:", error);
      toast.error("Algo salió mal :(");
    }
  };

  const openTaskDetails = async (task) => {
    try {
      const { data } = await api.get(`/tasks/${task.id}/`);
      setCurrentTask(data);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error("Error obteniendo la tarea:", error);
      toast.error("No se pudo cargar la tarea.");
    }
  };

  const openEditForm = (task) => {
    setCurrentTask(task);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDeleteConfirmation = (task) => {
    setCurrentTask(task);
    setIsDeleteOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterBy("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                filterBy === "all"
                  ? "Buscar tareas..."
                  : filterBy === "title"
                  ? "Buscar por título..."
                  : filterBy === "description"
                  ? "Buscar por descripción..."
                  : filterBy === "date"
                  ? "Buscar por fecha (dd/mm/aaaa)..."
                  : "Buscar por estado (completado/pendiente)..."
              }
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchTerm || filterBy !== "all") && (
              <Button variant="outline" onClick={clearFilters}>
                Limpiar
              </Button>
            )}
          </div>
        </div>

        <Button
          onClick={() => {
            setIsEditing(false);
            setCurrentTask(null);
            setIsFormOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      {searchTerm && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredTasks.length} de {tasks.length} tareas
          {filterBy !== "all" &&
            ` (filtrado por ${filterOptions
              .find((opt) => opt.value === filterBy)
              ?.label.toLowerCase()})`}
        </div>
      )}

      <TaskTable
        tasks={filteredTasks}
        onViewTask={openTaskDetails}
        onEditTask={openEditForm}
        onDeleteTask={openDeleteConfirmation}
      />

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={isEditing ? handleUpdateTask : handleCreateTask}
        task={isEditing ? currentTask : null}
        isEditing={isEditing}
      />

      <TaskDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        task={currentTask}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteTask}
        itemTitle={currentTask?.title || ""}
        itemType="tarea"
      />
    </div>
  );
}
