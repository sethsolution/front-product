"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CustomerForm({
  isOpen,
  onClose,
  customer,
  isEditing,
  setIsEditing,
  setCustomers,
  customers,
}) {
  // Configuramos React Hook Form con validaciones
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      last_name: "",
      description: "",
      email: "",
      age: 0,
    },
  });

  // Reset form when dialog opens/closes or when editing different customer
  useEffect(() => {
    if (isOpen) {
      if (customer && isEditing) {
        // Set form values when editing an existing customer
        setValue("name", customer.name);
        setValue("last_name", customer.last_name);
        setValue("description", customer.description || "");
        setValue("email", customer.email);
        setValue("age", customer.age);
      } else {
        // Reset to defaults for new customer
        reset({
          name: "",
          last_name: "",
          description: "",
          email: "",
          age: 0,
        });
      }
    }
  }, [customer, isEditing, isOpen, reset, setValue]);

  // Form submission handler
  const onFormSubmit = async (data) => {
    try {
      if (isEditing && customer) {
        await handleUpdateCustomer({
          ...customer,
          ...data,
          updated_at: new Date().toISOString(),
        });
      } else {
        await handleCreateCustomer({
          ...data,
        });
      }
    } catch (error) {
      // No need to close the form on error - handled in the specific functions
      console.error("Form submission error:", error);
    }
  };

  const handleCreateCustomer = async (newCustomer) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch("http://localhost:8000/customers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newCustomer),
      });

      const data = await response.json();

      if (data.detail) {
        // Handle field-specific errors
        if (data.detail[0].loc[1] === "email") {
          setError("email", {
            type: "server",
            message: "Este correo ya está en uso.",
          });
        }
      } else {
        setCustomers([...customers, data]);
        onClose();
      }
    } catch (error) {
      console.error("Detailed error creating customer:", error);
      if (!errors.email && !serverError) {
        setServerError(error.message || "Error al crear el cliente");
      }
      throw error;
    }
  };

  const handleUpdateCustomer = async (updatedCustomer) => {
    try {
      const response = await fetch(
        `http://localhost:8000/customers/${updatedCustomer.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(updatedCustomer),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: "Error al actualizar el cliente" }));

        // Handle field-specific errors
        if (errorData.email) {
          setError("email", { type: "server", message: errorData.email[0] });
        }

        throw new Error(
          errorData.detail || `Error al actualizar cliente (${response.status})`
        );
      }

      const updatedData = await response.json();
      setCustomers(
        customers.map((c) => (c.id === updatedData.id ? updatedData : c))
      );
      setIsEditing(false);
      return updatedData;
    } catch (error) {
      console.error("Error updating customer:", error);
      if (!errors.email && !serverError) {
        setServerError(error.message || "Error al actualizar el cliente");
      }
      throw error;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Cliente" : "Crear Nuevo Cliente"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 2,
                      message: "El nombre debe tener al menos 2 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "El nombre no puede exceder 50 caracteres",
                    },
                  })}
                  placeholder="Ingrese el nombre"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="last_name">Apellido</Label>
                <Input
                  id="last_name"
                  {...register("last_name", {
                    required: "El apellido es obligatorio",
                    minLength: {
                      value: 2,
                      message: "El apellido debe tener al menos 2 caracteres",
                    },
                    maxLength: {
                      value: 50,
                      message: "El apellido no puede exceder 50 caracteres",
                    },
                  })}
                  placeholder="Ingrese el apellido"
                  className={errors.last_name ? "border-destructive" : ""}
                />
                {errors.last_name && (
                  <p className="text-sm text-destructive">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "El correo electrónico es obligatorio",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Dirección de correo inválida",
                  },
                })}
                placeholder="ejemplo@correo.com"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                type="number"
                {...register("age", {
                  required: "La edad es obligatoria",
                  min: {
                    value: 1,
                    message: "La edad debe ser mayor a 0",
                  },
                  max: {
                    value: 120,
                    message: "La edad no puede ser mayor a 120 años",
                  },
                  valueAsNumber: true,
                })}
                className={errors.age ? "border-destructive" : ""}
              />
              {errors.age && (
                <p className="text-sm text-destructive">{errors.age.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Ingrese una descripción o notas sobre el cliente"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
