"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { ProductForm } from "./product-form";
import { ProductDetails } from "./product-details";
import { DeleteConfirmation } from "@/components/ui/delete-confirmation";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import { ProductList } from "./product-list";

export function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const normalizeProduct = (product, categoriesMap, brandsMap) => {
    const normalizedProduct = { ...product };

    if (product.category_id && !product.category) {
      const category = categoriesMap.get(product.category_id);
      if (category) {
        normalizedProduct.category = category;
      } else {
        normalizedProduct.category = {
          id: product.category_id,
          name: "Desconocida",
        };
      }
    }

    if (product.brand_id && !product.brand) {
      const brand = brandsMap.get(product.brand_id);
      if (brand) {
        normalizedProduct.brand = brand;
      } else {
        normalizedProduct.brand = { id: product.brand_id, name: "Desconocida" };
      }
    }

    return normalizedProduct;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
      const [categoriesResponse, brandsResponse, productsResponse] = await Promise.all([
        api.get("catalog/products_category/"),
        api.get("catalog/product_brand/"),
        api.get("products/"),
      ]);
      const categoriesData = await categoriesResponse.data;
      const brandsData = await brandsResponse.data;
      const productsData = await productsResponse.data;
      const categoriesMap = new Map();
        categoriesData.forEach((category) =>
          categoriesMap.set(category.id, category)
        );
      const brandsMap = new Map();
        brandsData.forEach((brand) => 
          brandsMap.set(brand.id, brand)
        );
      const normalizedProducts = productsData.map((product) =>
          normalizeProduct(product, categoriesMap, brandsMap)
        );
      
      setProducts(normalizedProducts);
      setCategories(categoriesData);
      setBrands(brandsData);
      setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (!searchTerm.trim()) return true;
    
    const search = searchTerm.toLowerCase().trim();
    return (
      product.title?.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search) ||
      (product.category?.name || "").toLowerCase().includes(search) ||
      (product.brand?.name || "").toLowerCase().includes(search) ||
      (product.price && product.price.toString().includes(search))
    )
  });

  const handleCreateProduct = async (newProduct) => {
    try {
      const productToCreate = {
        title: newProduct.title,
        price: newProduct.price,
        description: newProduct.description,
        image: newProduct.image,
        category_id: parseInt(newProduct.categoryId),
        brand_id: parseInt(newProduct.brandId),
      };
      const {data : createdProduct} = await api.post("products/", productToCreate);
      toast.success("Producto creado con éxito!");

      const category = categories.find(
        (c) => c.id === productToCreate.category_id
      );
      const brand = brands.find(
        (b) => b.id === productToCreate.brand_id
      );

      const completeProduct = {
        ...createdProduct,
        category: category || {
          id: productToCreate.category_id,
          name: "Desconocida",
        },
        brand: brand || {
          id: productToCreate.brand_id,
          name: "Desconocida",
        },
      };

      setProducts((prev) => [...prev, completeProduct]);
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error("Error al crear el producto: ");
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const productToUpdate = {
        title: updatedProduct.title,
        price: updatedProduct.price,
        description: updatedProduct.description,
        image: updatedProduct.image,
        category_id: parseInt(updatedProduct.categoryId),
        brand_id: parseInt(updatedProduct.brandId),
      };

      const {data : updatedData} = await api.patch(
        `products/${currentProduct.id}`,
        productToUpdate
      );
      toast.success("Producto actualizado con éxito!");

      const category = categories.find(
        (c) => c.id === productToUpdate.category_id
      );
      const brand = brands.find(
        (b) => b.id === productToUpdate.brand_id
      );

      setProducts((prev) =>
        prev.map((product) => {
          if (product.id === currentProduct.id) {
            return {
              ...product,
              ...updatedData,
              category: category || {
                id: productToUpdate.category_id,
                name: "Desconocida",
              },
              brand: brand || {
                id: productToUpdate.brand_id,
                name: "Desconocida",
              },
            };
          }

          return product;
        })
      );

      setIsFormOpen(false);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Error al actualizar el producto: ");
    }
  };

  const handleDeleteProduct = async () => {
    if (!currentProduct) return;
    try {
      await api.delete(`products/${currentProduct.id}`);
      toast.success("Producto eliminado con éxito!");
      
      setProducts((prev)=>
        prev.filter((product) => product.id !== currentProduct.id)
      );
      setIsDeleteOpen(false);
      setCurrentProduct(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Error al eliminar el producto: ");
    }
  };

  const openProductDetails = async (product) => {
    try {
      const { data } = await api.get(`/products/${product.id}`);
      
      const completeProduct = {
        ...data,
        category: data.category || {
          id: data.category_id,
          name: "Desconocida",
        },
        brand: data.brand || {
          id: data.brand_id,
          name: "Desconocida",
        },
      };
      setCurrentProduct(completeProduct);
      setIsDetailsOpen(true);
    } catch (err) {
      console.error("Error al cargar detalles del producto:", err);
      toast.error("No se pudo cargar el producto.");
    }
  };
  
  const openEditForm = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDeleteConfirmation = (product) => {
    setCurrentProduct(product);
    setIsDeleteOpen(true);
  };

  if (loading) return <div className="text-center py-10">Cargando...</div>;

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error}
        <div className="mt-4">
          <Button onClick={() => fetchData()}>Reintentar</Button>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        
        <Button
          onClick={() => {
            setIsEditing(false);
            setCurrentProduct(null);
            setIsFormOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <ProductList
        products={filteredProducts}
        onViewProduct={openProductDetails}
        onEditProduct={openEditForm}
        onDeleteProduct={openDeleteConfirmation}
        />

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={isEditing ? handleUpdateProduct : handleCreateProduct}
        product={currentProduct}
        isEditing={isEditing}
        categories={categories}
        brands={brands}
      />

      <ProductDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        product={currentProduct}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteProduct}
        itemTitle={currentProduct?.title || ""}
        itemType="producto"
      />
    </div>
  );
}