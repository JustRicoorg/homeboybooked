
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import ProductForm from "./ProductForm";

interface AddProductButtonProps {
  newProduct: Partial<Product>;
  imageFile: File | null;
  onNewProductChange: (product: Partial<Product>) => void;
  onImageChange: (file: File | null) => void;
  onAddProduct: () => void;
}

const AddProductButton: React.FC<AddProductButtonProps> = ({
  newProduct,
  imageFile,
  onNewProductChange,
  onImageChange,
  onAddProduct,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSave = () => {
    onAddProduct();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <div className="px-1 mt-4">
          <ProductForm
            product={newProduct}
            isEditing={false}
            imageFile={imageFile}
            onProductChange={onNewProductChange}
            onImageChange={onImageChange}
            onSave={handleSave}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductButton;
