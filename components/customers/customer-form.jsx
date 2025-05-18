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
import {api} from "@/lib/axios";
import toast from "react-hot-toast";

export function CustomerForm({
  isOpen,
  onClose,
  customer,
  isEditing,
  setIsEditing,
  setCustomers,
  customers,
}) {
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

  useEffect(() => {
    if (isOpen) {
      if (customer && isEditing) {
        setValue("name", customer.name);
        setValue("last_name", customer.last_name);
        setValue("description", customer.description || "");
        setValue("email", customer.email);
        setValue("age", customer.age);
      } else {
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
      console.error("Form submission error:", error);
    }
  };

  const handleCreateCustomer = async (newCustomer) => {
    const accessToken = localStorage.getItem("accessToken");
  
    try {
      const { data : createdCustomer } = await api.post(`/customers/`, newCustomer, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Cliente creado con éxito");
  
      setCustomers((prev)=>[...prev, createdCustomer]);
      onClose();
  
    } catch (error) {
      
      if (error.response?.status === 422) {
        const data = error.response.data;
        if (data.detail?.[0]?.loc[1] === "email") {
          setError("email", {
            type: "server",
            message: "Este correo ya está en uso.",
          });
          return; 
        }
      }
  
      if (!errors.email && !serverError) {
        setServerError(error.message || "Error al crear el cliente");
        toast.error("Error al crear el cliente");
      }
    }
  };

  const handleUpdateCustomer = async (updatedCustomer) => {
    try {
      const {data : updatedData} = await api.patch(`/customers/${updatedCustomer.id}`,updatedCustomer)
        toast.success("Cliente actualizado con exito");
        setCustomers((prev)=>
        prev.map((c) => (c.id === updatedData.id ? updatedData : c))
      );
      setIsEditing(false);
      onClose();
      return updatedData;
    } catch (error) {
      console.error("Error updating customer:", error);
      if (error.response?.data) {
        const errors = error.response.data;
        Object.entries(errors).forEach(([field, messages]) => {
          setError(field, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      } else {
        setServerError("Error al actualizar el cliente");
        toast.error("Error al actualizar el cliente");
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
