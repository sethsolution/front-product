import { CategoryManager } from "@/components/categories/category-manager";

export default async function CategoriesPage() {
  const resp = await fetch("http://localhost:8000/catalog/products_category/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await resp.json();
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 overflow-x-auto">
      <CategoryManager allCategories={data} />
    </div>
  );
}
