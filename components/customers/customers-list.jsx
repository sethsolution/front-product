import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Mail, Calendar, UserX } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function CustomerList({
  customers,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "dd MMM yyyy", { locale: es });
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName || "";
    const last = lastName || "";
    const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    return initials || "NA";
  };

  const getRandomColor = (id) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    return colors[id % colors.length];
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <UserX className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                No se encontraron clientes
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No hay clientes que coincidan con tu búsqueda o no has añadido
                ningún cliente aún.
              </p>
            </CardContent>
          </Card>
        ) : (
          customers.map((customer) => (
            <Card
              key={customer.id}
              className="flex flex-col gap-0 overflow-hidden h-full"
              onClick={() => onViewCustomer(customer)}
              style={{ padding: "inherit" }}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      className={`h-12 w-12 ${getRandomColor(customer.id)}`}
                    >
                      <AvatarFallback>
                        {getInitials(customer.name, customer.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg capitalize">
                        {customer.name} {customer.last_name}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 mr-1" />
                        {customer.email}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 pb-2">
                <div className="text-sm mb-2">
                  <span className="font-medium">Edad:</span> {customer.age} años
                </div>
                {customer.description ? (
                  <div className="text-sm text-muted-foreground">
                    <p className="line-clamp-2">{customer.description}</p>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p className="line-clamp-2">Sin descripción</p>
                  </div>
                )}
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  cliente desde {formatDate(customer.created_at)}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-2 mt-auto flex justify-end gap-2">
                <div className="flex gap-2 items-left-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCustomer(customer);
                    }}
                    className="text-xs h-8"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCustomer(customer);
                    }}
                    className="text-xs h-8"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
