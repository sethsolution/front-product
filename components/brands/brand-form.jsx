"use client";
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function BrandForm({
  isOpen,
  onClose,
  onSubmit,
  brand,
  isEditing
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    if (brand && isEditing) {
      setFormData({
        name: brand.name,
        description: brand.description,
      })
    } else {
      setFormData({
        name: "",
        description: "",
      })
    }
  }, [brand, isEditing, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isEditing && brand) {
      onSubmit({
        ...brand,
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
          <DialogTitle>{isEditing ? "Editar Marca" : "Crear Nueva Marca"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ingrese el nombre de la marca"
                required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ingrese una descripción para la marca"
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

