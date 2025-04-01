import { BrandManager } from "@/components/brands/brand-manager";

export default async function Page() {
  const resp = await fetch("http://localhost:8000/catalog/product_brand/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await resp.json();
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 overflow-x-auto">
      <BrandManager allBrands={data} />
    </div>
  );
}
