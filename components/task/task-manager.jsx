"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { TaskTable } from "@/components/task/task-table";
import { TaskForm } from "@/components/task/task-form";
import { TaskDetails } from "@/components/task/task-details";
import { DeleteConfirmation } from "@/components/ui/delete-confirmation";
import {api} from "@/lib/axios";
import { toast } from "react-hot-toast";

export function TaskManager({ allTasks }) {
  const [tasks, setTasks] = useState(allTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateTask = async (newTask) => {
    const task = {
      ...newTask,
      id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const taskToCreate = {
      title: task.title,
      description: task.description,
    };

    // await fetch(`http://localhost:8000/tasks/`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(taskToCreate),
    // });
    try{
      await api.post(`/tasks/`, taskToCreate);
      toast.success("Tarea creada con éxito!");
      setTasks([...tasks, task]);
      setIsFormOpen(false);
    }catch(error){
      console.error("Error creando la tarea:",error);
      toast.error("Algo salió mal :(");
    }

  };

  const handleUpdateTask = async (updatedTask) => {
    // await fetch(`http://localhost:8000/tasks/${updatedTask.id}`, {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(updatedTask),
    // });``
    try{

      await api.patch(`/tasks/${updatedTask.id}`, updatedTask);
      toast.success("Tarea actualizada con éxito!");
      setTasks(
        tasks.map((task) =>
          task.id === updatedTask.id
            ? { ...updatedTask, updated_at: new Date().toISOString() }
            : task
        )
      );
      setIsFormOpen(false);
      setIsEditing(false);
    }catch(error){
      console.error("Error editando la tarea:",error);
      toast.error("Algo salió mal :(");
    }
  };

  const handleDeleteTask = async () => {
    try{

      if (currentTask) {
        await api.delete(`/tasks/${currentTask.id}`);
        toast.success("Tarea eliminada con exito!");
        setTasks(tasks.filter((task) => task.id !== currentTask.id));
        setIsDeleteOpen(false);
        setCurrentTask(null);
      }
    }catch(error){
      console.error("Error eliminando la tarea:",error);
      toast.error("Algo salió mal :("); 
    }
  };

  const openTaskDetails = async(task) => {

    try{
      const {data} = await api.get(`/tasks/${task.id}/`);
      setCurrentTask(data);
      setIsDetailsOpen(true);
    }catch(error){
      console.error("Error obteniendo la tarea:",error);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tareas</h1>
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
      <TaskTable
        tasks={tasks}
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
        taskTitle={currentTask?.title || ""}
      />
    </div>
  );
}
