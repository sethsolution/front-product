import { BrandManager } from "@/components/brands/brand-manager";
import { api } from "@/lib/axios";

export default async function Page() {
  
  const {data} = await api.get("/catalog/product_brand/");

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 overflow-x-auto">
      <BrandManager allBrands={data} />
    </div>
  );
}
