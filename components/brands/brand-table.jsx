"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function BrandTable({
  brands,
  onViewBrand,
  onEditBrand,
  onDeleteBrand
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd MMM yyyy", { locale: es });
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden md:table-cell">Descripción</TableHead>
            <TableHead className="hidden md:table-cell">Creado</TableHead>
            <TableHead className="hidden md:table-cell">Actualizado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                No hay marcas disponibles
              </TableCell>
            </TableRow>
          ) : (
            brands.map((brand) => (
              <TableRow
                key={brand.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewBrand(brand)}>
                <TableCell>{brand.id}</TableCell>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell className="hidden md:table-cell max-w-[300px] truncate">{brand.description}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(brand.created_at)}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(brand.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewBrand(brand)
                      }}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalles</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditBrand(brand)
                      }}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteBrand(brand)
                      }}>
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

