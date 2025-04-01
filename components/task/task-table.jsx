"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function TaskTable({ tasks, onViewTask, onEditTask, onDeleteTask }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: es });
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="hidden md:table-cell">Creado</TableHead>
            <TableHead className="hidden md:table-cell">Actualizado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-muted-foreground"
              >
                No hay tareas disponibles
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow
                key={task.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewTask(task)}
              >
                <TableCell>{task.id}</TableCell>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                  {task.description}
                </TableCell>
                <TableCell>
                  <Badge variant={task.completed ? "success" : "default"}>
                    {task.completed ? "Completada" : "Pendiente"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(task.created_at)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(task.updated_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewTask(task);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalles</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
