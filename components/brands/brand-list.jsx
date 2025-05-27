import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2, Edit, Eye, Briefcase } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BrandList({ brands, onViewBrand, onEditBrand, onDeleteBrand }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    return format(new Date(dateString), "dd MMM yyyy", { locale: es });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {brands.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              {/* <Tag className="h-10 w-10 text-muted-foreground" /> */}
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              No se encontraron marcas
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No hay marcas que coincidan con tu búsqueda o no has añadido
              ninguna marca aún.
            </p>
          </CardContent>
        </Card>
      ) : (
        brands.map((brand) => (
          <Card
            key={brand.id}
            className="overflow-hidden"
            style={{ padding: "inherit" }}
          >
            <div className="flex flex-col flex-grow">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 p-2 rounded-full bg-primary/10">
                      {/* <Tag className="h-4 w-4 text-primary" /> */}
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="capitalize font-semibold text-lg">
                      {brand.name}
                    </h3>
                  </div>
                  <div className="text-sm font-medium bg-muted px-2 py-1 rounded-md">
                    {brand.productCount} productos
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2 pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {brand.description || "Sin descripción"}
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Creada el {formatDate(brand.created_at)}
                </div>
              </CardContent>
              <CardFooter className="p-3 sm:p-4 pt-2 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                  onClick={() => onViewBrand(brand)}
                >
                  <Eye className="h-4 w-4" />
                  Ver detalles
                </Button>
                <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-initial"
                    onClick={() => onEditBrand(brand)}
                  >
                    <Edit className="h-3.5 w-3.5 2xl:mr-0 mr-1" />
                    <span className="2xl:hidden">Editar</span>
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 sm:flex-initial text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBrand(brand);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 2xl:mr-0 mr-1" />
                    <span className="2xl:hidden">Eliminar</span>
                  </Button>
                </div>
              </CardFooter>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
