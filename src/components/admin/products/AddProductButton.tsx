
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Product</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ProductForm
            product={newProduct}
            isEditing={false}
            imageFile={imageFile}
            onProductChange={onNewProductChange}
            onImageChange={onImageChange}
            onSave={onAddProduct}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddProductButton;
