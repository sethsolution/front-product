"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function CategoryTable({
  categories,
  onViewCategory,
  onEditCategory,
  onDeleteCategory
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
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                No hay categorías disponibles
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow
                key={category.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewCategory(category)}>
                <TableCell>{category.id}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="hidden md:table-cell max-w-[300px] truncate">{category.description}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(category.created_at)}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(category.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewCategory(category)
                      }}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalles</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditCategory(category)
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
                        onDeleteCategory(category)
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

