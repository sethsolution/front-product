"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CustomerTable } from "./customer-table";
import { CustomerForm } from "./customer-form";
import { CustomerDetails } from "./customer-dateils";
import { DeleteConfirmation } from "../ui/delete-confirmation";

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
        const response = await fetch("http://localhost:8000/customers/", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        setCustomers(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      }
    };

    fetchCustomers();
  }, [router]);

  const handleDeleteCustomer = async () => {
    if (currentCustomer) {
      await fetch(
        `http://localhost:8000/customers/${currentCustomer.id}`,

        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCustomers(
        customers.filter((customer) => customer.id !== currentCustomer.id)
      );
      setIsDeleteOpen(false);
      setCurrentCustomer(null);
    }
  };

  const openCustomerDetails = async(customer) => {
    if (customer){
      const response = await fetch(
        `http://localhost:8000/customers/${customer.id}/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setCurrentCustomer(data);
    }
    // setCurrentCustomer(customer);
    setIsDetailsOpen(true);
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
