"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CustomerTable } from "./customer-table";
import { CustomerForm } from "./customer-form";
import { CustomerDetails } from "./customer-dateils";
import { DeleteConfirmation } from "../ui/delete-confirmation";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";

export function CustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        router.push("/login");
        return;
      }

      try { 
        const {data} = await api.get(`/customers/`,{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        })

        setCustomers(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("No se pudo cargar la información de clientes")
        router.push("/login");
      }
    };

    fetchCustomers();
  }, [router]);

  const handleDeleteCustomer = async () => {
    if (currentCustomer) {
      try{
        await api.delete(`/customers/${currentCustomer.id}/`);
        toast.success("Clietne eliminado con éxito");
        setCustomers((prev)=>
          prev.filter((customer) => customer.id !== currentCustomer.id)
        );
        setIsDeleteOpen(false);
        setCurrentCustomer(null);
      }catch(error){
        console.error("Error eliminando el cliente:", error);
        toast.error("Error elimando el cliente");
      }
      }
  };

  const openCustomerDetails = async(customer) => {
    if (customer){
      try{
        const {data} = await api.get(`/customers/${customer.id}/`);
        setCurrentCustomer(data);
        setIsDetailsOpen(true);
      }catch(error){
        console.error("Error mostrando detalles del cliente", error);
        toast.error("No se pudo cargar la información del cliente.");
      }
    }
  };

  const openEditForm = (customer) => {
    setCurrentCustomer(customer);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDeleteConfirmation = (customer) => {
    setCurrentCustomer(customer);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button
          onClick={() => {
            setIsEditing(false);
            setCurrentCustomer(null);
            setIsFormOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>
      <CustomerTable
        customers={customers}
        onViewCustomer={openCustomerDetails}
        onEditCustomer={openEditForm}
        onDeleteCustomer={openDeleteConfirmation}
      />
      <CustomerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        customer={isEditing ? currentCustomer : null}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setCustomers={setCustomers}
        customers={customers}
      />
      <CustomerDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        customer={currentCustomer}
      />
      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteCustomer}
        taskTitle={
          currentCustomer
            ? `${currentCustomer.name} ${currentCustomer.last_name}`
            : ""
        }
      />
    </div>
  );
}
