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
import { Edit, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function CustomerTable({
  customers,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd MMM yyyy", { locale: es });
  };

  return (
    <div className="w-full overflow-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Edad</TableHead>
            <TableHead className="hidden md:table-cell">Creado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-muted-foreground"
              >
                No hay clientes disponibles
              </TableCell>
            </TableRow>
          ) : (
            customers?.map((customer) => (
              <TableRow
                key={customer.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewCustomer(customer)}
              >
                <TableCell>{customer.id}</TableCell>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.last_name}</TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {customer.email}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {customer.age}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(customer.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewCustomer(customer);
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
                        onEditCustomer(customer);
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
                        onDeleteCustomer(customer);
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
