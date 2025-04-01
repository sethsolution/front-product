"use client";
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CustomerForm({
  isOpen,
  onClose,
  onSubmit,
  customer,
  isEditing
}) {
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    description: "",
    email: "",
    age: 0,
  })

  useEffect(() => {
    if (customer && isEditing) {
      setFormData({
        name: customer.name,
        last_name: customer.last_name,
        description: customer.description,
        email: customer.email,
        age: customer.age,
      })
    } else {
      setFormData({
        name: "",
        last_name: "",
        description: "",
        email: "",
        age: 0,
      })
    }
  }, [customer, isEditing, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAgeChange = (e) => {
    const value = Number.parseInt(e.target.value)
    setFormData((prev) => ({ ...prev, age: isNaN(value) ? 0 : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isEditing && customer) {
      onSubmit({
        ...customer,
        ...formData,
        updated_at: new Date().toISOString(),
      })
    } else {
      onSubmit({
        ...formData,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Cliente" : "Crear Nuevo Cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre"
                  required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="last_name">Apellido</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Ingrese el apellido"
                  required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="0"
                max="120"
                value={formData.age}
                onChange={handleAgeChange}
                required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ingrese una descripción o notas sobre el cliente"
                rows={3} />
            </div>
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

