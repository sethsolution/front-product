"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { CustomerForm } from "./customer-form";
import { CustomerList } from "./customers-list";
import { CustomerDetails } from "./customer-dateils";
import { DeleteConfirmation } from "../ui/delete-confirmation";
import { AuthRequiredModal } from "../auth/auth-modal";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";

export function CustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReturnPath, setCurrentReturnPath] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();

  const filterCustomers = customers.filter((customer) => {
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase().trim();
    const fullName = `${customer.name} ${customer.last_name}`.toLowerCase();
    return (
      customer.name.toLowerCase().includes(search) ||
      customer.last_name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      fullName.includes(search)
    );
  });
  useEffect(() => {
    const fetchCustomers = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        const currentPath = window.location.pathname;
        setIsAuthModalOpen(true);
        setCurrentReturnPath(currentPath);
        return;
      }

      try {
        const { data } = await api.get(`/customers/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setCustomers(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          setIsAuthModalOpen(true);
        } else {
          toast.error("No se pudo cargar la información de clientes");
        }
      }
    };

    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async () => {
    if (currentCustomer) {
      try {
        await api.delete(`/customers/${currentCustomer.id}/`);
        toast.success("Clietne eliminado con éxito");
        setCustomers((prev) =>
          prev.filter((customer) => customer.id !== currentCustomer.id)
        );
        setIsDeleteOpen(false);
        setCurrentCustomer(null);
      } catch (error) {
        console.error("Error eliminando el cliente:", error);
        toast.error("Error elimando el cliente");
      }
    }
  };

  const openCustomerDetails = async (customer) => {
    if (customer) {
      try {
        const { data } = await api.get(`/customers/${customer.id}/`);
        setCurrentCustomer(data);
        setIsDetailsOpen(true);
      } catch (error) {
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
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
      <CustomerList
        customers={filterCustomers}
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
        itemTitle={
          currentCustomer
            ? `${currentCustomer.name} ${currentCustomer.last_name}`
            : ""
        }
        itemType="cliente"
      />
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        returnPath={currentReturnPath}
      />
    </div>
  );
}
