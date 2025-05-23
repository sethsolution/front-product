import { ProductManager } from "@/components/products/product-manager";
import { api } from "@/lib/axios";

export default async function Page() {

  const resp = await api.get("/products/");
  const data = resp.data;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 overflow-x-auto">

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Gestión de Productos</h1>
        <p className="text-muted-foreground">Administra tu catálogo de productos</p>
      </div>

      <ProductManager allProducts={data} />
    </div>
  );
}
