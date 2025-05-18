"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  itemType="elemento",

}) {

  const defaultTitle = `¿Está seguro de eliminar ${itemType === "elemento" ? "este" : ["producto","cliente"].includes(itemType) ? "este" : "esta"} ${itemType}?`;


  const defaultDescription = (
    <>
      Está a punto de eliminar {itemType === "elemento" ? "el" : itemType === "producto" ? "el" : itemType === "cliente" ? "al" : "la"} {itemType}{" "}
      <span className="font-medium">&quot;{itemTitle}&quot;</span>. Esta acción no se puede deshacer.
    </>
  );
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{defaultTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-white hover:bg-destructive/90">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

