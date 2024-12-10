import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";

export function ProductDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Tambah Produk</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
        </DialogHeader>
        <ProductForm />
      </DialogContent>
    </Dialog>
  );
}