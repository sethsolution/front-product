import { ProductManager } from "@/components/products/product-manager";
import { api } from "@/lib/axios";

export default async function Page() {

  const resp = await api.get("/products/");
  const data = resp.data;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 overflow-x-auto">
      <ProductManager allProducts={data} />
    </div>
  );
}
