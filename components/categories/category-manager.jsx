"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CategoryTable } from "./category-table";
import { CategoryForm } from "./category-form";
import { CategoryDetails } from "./category-details";
import { DeleteConfirmation } from "../ui/delete-confirmation";

export function CategoryManager({ allCategories }) {
  const [categories, setCategories] = useState(allCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateCategory = async (newCategory) => {
    const category = {
      ...newCategory,
      id: Math.max(0, ...categories.map((c) => c.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const categoryToCreate = {
      name: category.name,
      description: category.description,
    };
    await fetch(`http://localhost:8000/catalog/products_category/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryToCreate),
    });
    setCategories([...categories, category]);
    setIsFormOpen(false);
  };

  const handleUpdateCategory = async (updatedCategory) => {
    await fetch(
      `http://localhost:8000/catalog/products_category/${updatedCategory.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategory),
      }
    );
    setCategories(
      categories.map((category) =>
        category.id === updatedCategory.id
          ? { ...updatedCategory, updated_at: new Date().toISOString() }
          : category
      )
    );
    setIsFormOpen(false);
    setIsEditing(false);
  };

  const handleDeleteCategory = async () => {
    if (currentCategory) {
      await fetch(
        `http://localhost:8000/catalog/products_category/${currentCategory.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCategories(
        categories.filter((category) => category.id !== currentCategory.id)
      );
      setIsDeleteOpen(false);
      setCurrentCategory(null);
    }
  };

  const openCategoryDetails = (category) => {
    setCurrentCategory(category);
    setIsDetailsOpen(true);
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
        taskTitle={currentCategory?.name || ""}
      />
    </div>
  );
}
