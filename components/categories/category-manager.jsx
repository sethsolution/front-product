"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CategoryTable } from "./category-table";
import { CategoryForm } from "./category-form";
import { CategoryDetails } from "./category-details";
import { DeleteConfirmation } from "../ui/delete-confirmation";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";

export function CategoryManager({ allCategories }) {
  const [categories, setCategories] = useState(allCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateCategory = async (newCategory) => {
    try {
      const {data: createdCategory } = await api.post(`/catalog/products_category/`, newCategory)
      toast.success("Categoría creada con éxito!");
      setCategories((prev)=> [...prev, createdCategory]);
      setIsFormOpen(false);
    }catch(error){
      console.error("Error creando la categoria:",error);
      toast.error("Algo salió mal :(");
    }
  };

  const handleUpdateCategory = async (updatedCategory) => {
    
    try {
      const { data: updated } = await api.patch(`/catalog/products_category/${updatedCategory.id}/`, updatedCategory);
      toast.success("Categoría actualizada con éxito!");
      setCategories((prev)=>
        prev.map((category) => 
          category.id === updatedCategory.id ? updated : category)
      );
      setIsFormOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error actualizando la categoría:", error);
      toast.error("Algo salió mal :(");
    }
  };

  const handleDeleteCategory = async () => {
    if (currentCategory) {
      try {
        await api.delete(`/catalog/products_category/${currentCategory.id}`)
        toast.success("Categoría eliminada con éxito!");
        
        setCategories((prev) =>
          prev.filter((category) => category.id !== currentCategory.id)
      );
        setIsDeleteOpen(false);
        setCurrentCategory(null);
      } catch(error){
        console.error("Error eliminando la categoria:", error);
        toast.error("Algo salió mal :(");

      }
    }
  };

  const openCategoryDetails = async(category) => {
    if (category) {
      try {
        
        const {data} = await api.get(`/catalog/products_category/${category.id}/`);
        setCurrentCategory(data);
        setIsDetailsOpen(true);
      } catch (error) {
        console.error("Error fetching category details:", error);
        setCurrentCategory(category);
      }
    }
  };

  const openEditForm = (category) => {
    setCurrentCategory(category);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDeleteConfirmation = (category) => {
    setCurrentCategory(category);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Button
          onClick={() => {
            setIsEditing(false);
            setCurrentCategory(null);
            setIsFormOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>
      <CategoryTable
        categories={categories}
        onViewCategory={openCategoryDetails}
        onEditCategory={openEditForm}
        onDeleteCategory={openDeleteConfirmation}
      />
      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={isEditing ? handleUpdateCategory : handleCreateCategory}
        category={isEditing ? currentCategory : null}
        isEditing={isEditing}
      />
      <CategoryDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        category={currentCategory}
      />
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteCategory}
        itemTitle={currentCategory?.name || ""}
        itemType="categoría"
      />
    </div>
  );
}
