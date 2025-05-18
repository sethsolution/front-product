"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, set } from "date-fns";
import { es } from "date-fns/locale";
import { Package } from "lucide-react";

export function ProductDetails({ isOpen, onClose, product }) {
  if (!product) return null;

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: es });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles del Producto</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-[200px_1fr] gap-6">
          <div className="flex items-center justify-center">
            <div className="h-40 w-40 rounded-md bg-muted flex items-center justify-center overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                <Package className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{product.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{product.category.name}</Badge>
                <Badge variant="secondary">{product.brand.name}</Badge>
              </div>
              <p className="text-xl font-bold mt-2">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Descripción
              </h4>
              <p className="text-sm">
                {product.description || "Sin descripción"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-muted-foreground">ID</h4>
                <p>{product.id}</p>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground">
                  Fecha de creación
                </h4>
                <p>{formatDate(product.created_at)}</p>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground">Categoría</h4>
                <p>{product.category.name}</p>
              </div>

              <div>
                <h4 className="font-medium text-muted-foreground">Marca</h4>
                <p>{product.brand.name}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
