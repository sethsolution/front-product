"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { refreshToken } from "@/lib/refreshToken";
import { handleLogoutSession } from "@/lib/logout";
import { useRouter } from "next/navigation";

export function RefreshModal({ isOpen, onClose, onSuccess }) {
  const router = useRouter();
  
  const handleLogout = async () => {

    try {
      const accessToken = localStorage.getItem("accessToken");
      onClose?.();
      
      await handleLogoutSession(accessToken, router);
    } catch (error) {
      console.error("Error durante logout desde el modal:", error);
    }
  };

  
  const handleRefresh = async () => {
    try {
      const newToken = await refreshToken();
      if (newToken) {
        onSuccess?.(newToken);
        onClose();
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      handleLogout();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open)=>{
      if(!open){
        handleLogout();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Sesión a punto de expirar</DialogTitle>
          <DialogDescription className="pt-4 text-base text-center text-foreground">
            Su sesión está a punto de expirar. ¿Desea mantenerla activa?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"flex flex-col sm:flex-row sm:justify-between sm:space-x-2"}>
          <Button
            variant="outline"
            onClick={handleLogout}
            className={"mb-2 sm:mb-0 bg-blue-100 hover:bg-blue-200 text-blue-700"}
          >
            Cerrar sesión
          </Button>
          <Button
            onClick={handleRefresh}
            className={"bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"}
          >
            Mantener sesión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}