"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ProductTable } from "./product-table";
import { ProductForm } from "./product-form";
import { ProductDetails } from "./product-details";
import { DeleteConfirmation } from "@/components/ui/delete-confirmation";

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
        const categoriesResponse = await fetch(
          "http://localhost:8000/catalog/products_category/"
        );
        if (!categoriesResponse.ok)
          throw new Error("Error al cargar categorías");
        const categoriesData = await categoriesResponse.json();

        const categoriesMap = new Map();
        categoriesData.forEach((category) =>
          categoriesMap.set(category.id, category)
        );

        const brandsResponse = await fetch(
          "http://localhost:8000/catalog/product_brand/"
        );
        if (!brandsResponse.ok) throw new Error("Error al cargar marcas");
        const brandsData = await brandsResponse.json();

        const brandsMap = new Map();
        brandsData.forEach((brand) => brandsMap.set(brand.id, brand));

        const productsResponse = await fetch("http://localhost:8000/products/");
        if (!productsResponse.ok) throw new Error("Error al cargar productos");
        const productsData = await productsResponse.json();

        const normalizedProducts = productsData.map((product) =>
          normalizeProduct(product, categoriesMap, brandsMap)
        );

        setProducts(normalizedProducts);
        setCategories(categoriesData);
        setBrands(brandsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

      const response = await fetch("http://localhost:8000/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToCreate),
      });

      if (!response.ok) throw new Error("Error al crear el producto");

      const createdProduct = await response.json();

      const category = categories.find(
        (c) => c.id === parseInt(newProduct.categoryId)
      );
      const brand = brands.find((b) => b.id === parseInt(newProduct.brandId));

      const completeProduct = {
        ...createdProduct,
        category: category || {
          id: parseInt(newProduct.categoryId),
          name: "Desconocida",
        },
        brand: brand || {
          id: parseInt(newProduct.brandId),
          name: "Desconocida",
        },
      };

      setProducts((prev) => [...prev, completeProduct]);
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Error al crear el producto: " + err.message);
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

      const response = await fetch(
        `http://localhost:8000/products/${currentProduct.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productToUpdate),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el producto");

      const category = categories.find(
        (c) => c.id === parseInt(updatedProduct.categoryId)
      );
      const brand = brands.find(
        (b) => b.id === parseInt(updatedProduct.brandId)
      );

      setProducts((prev) =>
        prev.map((product) => {
          if (product.id === currentProduct.id) {
            return {
              ...product,
              ...productToUpdate,
              category: category || {
                id: parseInt(updatedProduct.categoryId),
                name: "Desconocida",
              },
              brand: brand || {
                id: parseInt(updatedProduct.brandId),
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
      alert("Error al actualizar el producto: " + err.message);
    }
  };

  const handleDeleteProduct = async () => {
    if (currentProduct) {
      try {
        const response = await fetch(
          `http://localhost:8000/products/${currentProduct.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Error al eliminar el producto");

        setProducts(
          products.filter((product) => product.id !== currentProduct.id)
        );
        setIsDeleteOpen(false);
        setCurrentProduct(null);
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Error al eliminar el producto: " + err.message);
      }
    }
  };

  const openProductDetails = (product) => {
    setCurrentProduct(product);
    setIsDetailsOpen(true);
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
          <Button onClick={fetchData}>Reintentar</Button>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Productos</h1>
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

      <ProductTable
        products={products}
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
        taskTitle={currentProduct?.title || ""}
      />
    </div>
  );
}
