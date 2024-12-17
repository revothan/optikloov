import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";

interface ProductDialogProps {
  mode?: "create" | "edit";
  product?: Tables<"products">;
  trigger?: React.ReactNode;
}

export function ProductDialog({ mode = "create", product, trigger }: ProductDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Tambah Produk</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Produk Baru" : "Edit Produk"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm 
          mode={mode} 
          product={product} 
          onSuccess={() => setOpen(false)} 
        />
        <DialogClose asChild>
          <Button variant="outline" className="mt-4">
            Batal
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}