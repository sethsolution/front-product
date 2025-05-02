"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { BrandTable } from "./brand-table";
import { BrandForm } from "./brand-form";
import { BrandDetails } from "./brand-details";
import { DeleteConfirmation } from "../ui/delete-confirmation";
import { api } from "@/lib/axios";
import { toast } from "react-hot-toast";

export const BrandManager = ({ allBrands }) => {
  const [brands, setBrands] = useState(allBrands);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreateBrand = async (newBrand) => {

    try{
      const {data : createdBrand} = await api.post(`/catalog/product_brand/`, newBrand);
      toast.success("Marca creada con éxito!");
      setBrands((prev)=> [...prev, createdBrand]);
      setIsFormOpen(false);
    }catch(error){
      console.error("Error creando la marca:",error);
      toast.error("Algo salió mal :(");
    }
  };

  const handleUpdateBrand = async (updatedBrand) => {
    
    try{
      const {data : updated} = await api.patch(`/catalog/product_brand/${updatedBrand.id}/`,updatedBrand);
      toast.success("Marca actualizada con éxito!");
      
      setBrands((prev) =>
        prev.map((brand)=>
        brand.id === updatedBrand.id ? updated : brand)
      );
      setIsFormOpen(false);
      setIsEditing(false);
    }catch(error){
      console.error("Error actualizando la marca:",error);
      toast.error("Algo salió mal :(");
    }
  };

  const handleDeleteBrand = async () => {
    if (currentBrand) {
      try{
        await api.delete(`/catalog/product_brand/${currentBrand.id}/`);
        toast.success("Marca eliminada con éxito!");
  
        setBrands((prev)=>
          prev.filter((brand) => brand.id !== currentBrand.id)
      );
        setIsDeleteOpen(false);
        setCurrentBrand(null);

      }catch(error){
      console.error("Error actualizando la marca:",error);
      toast.error("Algo salió mal :(");
      }
    }
  };

  const openBrandDetails = async (brand) => {
    try{
      const {data} = await api.get(`/catalog/product_brand/${brand.id}/`);
      setCurrentBrand(data);
      setIsDetailsOpen(true);
    }catch{
      console.error("Error obteniendo la Marca:",error);
      toast.error("No se pudo cargar la Marca.");
    }
  };

  const openEditForm = (brand) => {
    setCurrentBrand(brand);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDeleteConfirmation = (brand) => {
    setCurrentBrand(brand);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marcas</h1>
        <Button
          onClick={() => {
            setIsEditing(false);
            setCurrentBrand(null);
            setIsFormOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Marca
        </Button>
      </div>
      <BrandTable
        brands={brands}
        onViewBrand={openBrandDetails}
        onEditBrand={openEditForm}
        onDeleteBrand={openDeleteConfirmation}
      />
      <BrandForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={isEditing ? handleUpdateBrand : handleCreateBrand}
        brand={isEditing ? currentBrand : null}
        isEditing={isEditing}
      />
      <BrandDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        brand={currentBrand}
      />
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteBrand}
        itemTitle={currentBrand?.name || ""}
        itemType="marca"
      />
    </div>
  );
};
