import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const ProductList = ({ 
  products,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [imageError, setImageError] = useState({});

  const productsFormat = products.map((product) => {
    const category = {
      id: product?.category?.id ?? "NO-CATEGORY-ID",
      name: product?.category?.name ?? "Sin categoría",
      description: product?.category?.description ?? "",
    };

    const brand = {
      id: product?.brand?.id ?? "NO-BRAND-ID",
      name: product?.brand?.name ?? "Sin marca",
      description: product?.brand?.description ?? "",
    };

    return {
      title: product?.title ?? "Sin título",
      price: product?.price ?? 0,
      description: product?.description ?? "",
      image: product?.image ?? "",
      id: product?.id ?? "",
      created_at: product?.created_at,
      category,
      brand,
    };
  });

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: es });
    } catch (error) {
      return "Fecha no disponible";
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  const handleImageError = (id) => {
    setImageError((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      { productsFormat.length === 0 ? (
            <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No hay productos disponibles. ¡Añade un nuevo producto!
        </CardContent>
      </Card>
          ) : 
      
      (productsFormat.map((product) => (
        <Card 
          key={product.id} 
          className="flex flex-col gap-0 overflow-hidden h-full"
          onClick={() => onViewProduct(product)}
          style={{ padding: "inherit" }}

        >
          <div className="relative w-full h-40 bg-muted ">
            {imageError[product.id] ? (
              <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                Imagen no disponible
              </div>
            ) : (
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill={true}
                className="object-cover"
                sizes="100%"
                onError={() => handleImageError(product.id)}
              />

            )}
          </div>
          
          <div className="flex flex-col flex-grow">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-lg font-medium line-clamp-1">
                {product.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-3 py-2 flex-grow">
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {product.description}
              </p>
              <p className="font-bold text-lg mb-2">
                {formatPrice(product.price)}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{product.category.name}</Badge>
                <Badge variant="outline">{product.brand.name}</Badge>
              </div>
            </CardContent>
            
            <CardFooter className="p-3 pt-0 flex justify-between">
              <Button
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProduct(product);
                }}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProduct(product);
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
            </CardFooter>
          </div>
        </Card>
      )))}
    </div>
  );
};