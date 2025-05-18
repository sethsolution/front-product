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
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Package } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

export const ProductTable = ({
  products,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const productsFormat = products.map((product) => {
    const category = {
      id: product?.category?.id ?? "NO-CATEGORY-ID",
      name: product?.category?.name ?? "NO_CATEGORY_NAME",
      description: product?.category?.description ?? "NO_CATEGORY_DESCRIPTION",
    };

    const brand = {
      id: product?.brand?.id ?? "NO-BRAND-ID",
      name: product?.brand?.name ?? "NO_BRAND_NAME",
      description: product?.brand?.description ?? "NO_BRAND_DESCRIPTION",
    };

    return {
      title: product?.title ?? "NO_TITLE",
      price: product.price,
      description: product.description,
      image: product.image,
      id: product.id,
      created_at: product.created_at,
      category,
      brand,
    };
  });

  const formatDate = (dateString) =>
    format(new Date(dateString), "dd MMM yyyy", { locale: es });

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead className="hidden md:table-cell">Categoría</TableHead>
            <TableHead className="hidden md:table-cell">Marca</TableHead>
            <TableHead className="hidden md:table-cell">Creado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productsFormat.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-muted-foreground"
              >
                No hay productos disponibles
              </TableCell>
            </TableRow>
          ) : (
            productsFormat.map((product) => (
              <TableRow
                key={product.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewProduct(product)}
              >
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        width={40}  // Add this property
                        height={40} // Add this property too, for proper aspect ratio
                        className="h-full w-full object-cover"
                      />
                      ) : (
                        <Package className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <span className="font-medium">{product.title}</span>
                  </div>
                </TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{product.category.name}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.brand.name}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(product.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProduct(product);
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
                        onEditProduct(product);
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
                        onDeleteProduct(product);
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
};
