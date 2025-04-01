"use client";
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  task,
  isEditing
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false,
  })

  useEffect(() => {
    if (task && isEditing) {
      setFormData({
        title: task.title,
        description: task.description,
        completed: task.completed,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        completed: false,
      })
    }
  }, [task, isEditing, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, completed: checked }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing && task) {
      onSubmit({ ...task, ...formData })
    } else {
      onSubmit(formData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Tarea" : "Crear Nueva Tarea"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ingrese el título de la tarea"
                required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ingrese la descripción de la tarea"
                rows={4} />
            </div>
            {isEditing && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="completed"
                  checked={formData.completed}
                  onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="completed">Marcar como completada</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

