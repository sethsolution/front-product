"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

export function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  product,
  isEditing,
  categories,
  brands,
}) {
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    description: "",
    image: "",
    categoryId: "",
    brandId: "",
  });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        title: product.title,
        price: product.price,
        description: product.description,
        image: product.image,
        categoryId: product.category.id.toString(),
        brandId: product.brand.id.toString(),
      });
      setImageError(false);
    } else {
      setFormData({
        title: "",
        price: 0,
        description: "",
        image: "",
        categoryId: "",
        brandId: "",
      });
      setImageError(false);
    }
  }, [product, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "image") {
      setImageError(false);
    }
  };

  const handlePriceChange = (e) => {
    const value = Number.parseFloat(e.target.value);
    setFormData((prev) => ({ ...prev, price: isNaN(value) ? 0 : value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedCategory = categories.find((c) => c.id.toString() === formData.categoryId);
    const selectedBrand = brands.find((b) => b.id.toString() === formData.brandId);
    if (!selectedCategory || !selectedBrand) return;
    onSubmit({
      ...formData,
      category: selectedCategory,
      brand: selectedBrand,
    });
  };

  return (
  <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
  <DialogContent className="sm:max-w-[800px]">
    <DialogHeader>
      <DialogTitle>{isEditing ? "Editar Producto" : "Crear Nuevo Producto"}</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit}>
      <div
        className={`grid gap-6 py-4 ${
          formData.image ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* Imagen (solo si hay URL) */}
        {formData.image && (
          <div className="flex items-center justify-center">
            <div>
              <Label className="mb-2 block">Vista previa</Label>
              <div className="relative h-64 w-64 bg-muted rounded-md overflow-hidden">
                {imageError ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                    Imagen no válida
                  </div>
                ) : (
                  <Image
                    src={formData.image}
                    alt="Vista previa"
                    className="h-full w-full object-cover"
                    width={256}
                    height={256}
                    onError={handleImageError}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Nombre del Producto</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              placeholder="Nombre del producto"
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handlePriceChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">URL de Imagen</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                placeholder="https://ejemplo.com/imagen.jpg"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="categoryId">Categoría</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleSelectChange("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brandId">Marca</Label>
              <Select
                value={formData.brandId}
                onValueChange={(value) => handleSelectChange("brandId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar marca" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              placeholder="Descripción del producto"
              onChange={handleChange}
              rows={4}
            />
          </div>
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