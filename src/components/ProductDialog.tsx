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

export function ProductDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah Produk</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
        </DialogHeader>
        <ProductForm onSuccess={() => setOpen(false)} />
        <DialogClose asChild>
          <Button variant="outline" className="mt-4">
            Batal
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}