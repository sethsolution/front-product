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
import { useRouter } from "next/navigation";
import { LockIcon } from "lucide-react";

export function AuthRequiredModal({ isOpen, onClose, returnPath }) {
  const router = useRouter();
  const handleLogin = () => {
    router.push(`/login?next=${encodeURIComponent(returnPath || router.asPath)}`);
    onClose?.();
  };

  const handleRegister = () => {
    router.push(`/register?next=${encodeURIComponent(returnPath || router.asPath)}`);
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={"sm:max-w-md"}>
        <DialogHeader>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary-100 to-secondary-200 mb-4">
                <LockIcon className="h-10 w-10 text-secondary-600" />
            </div>
          <DialogTitle className="text-center text-xl bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-blue-800">Inicio de sesión requerido</DialogTitle>
          <DialogDescription className="pt-2 text-base text-foreground">
            Para acceder a esta sección, es necesario iniciar sesión. Por favor, inicie sesión o regístrese para continuar.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"flex flex-col sm:flex-row sm:justify-between sm:space-x-2"}>
          <Button 
            variant="outline" 
            onClick={handleRegister} 
            className={"mb-2 sm:mb-0 bg-blue-100 hover:bg-blue-200 text-blue-700"}
          >
            Registrarse
          </Button>
          <Button 
            onClick={handleLogin} 
            className={"bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"}
          >
            Iniciar sesión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}