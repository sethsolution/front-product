import { CategoryManager } from "@/components/categories/category-manager";
import { api } from "@/lib/axios";

export default async function CategoriesPage() {

  const {data} = await api.get("/catalog/products_category/");
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 overflow-x-auto">
      <CategoryManager allCategories={data} />
    </div>
  );
}
