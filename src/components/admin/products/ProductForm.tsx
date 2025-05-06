
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/product";

interface ProductFormProps {
  product: Partial<Product>;
  isEditing: boolean;
  imageFile: File | null;
  onProductChange: (product: Partial<Product>) => void;
  onImageChange: (file: File | null) => void;
  onSave: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  isEditing, 
  imageFile, 
  onProductChange, 
  onImageChange, 
  onSave 
}) => {
  const idPrefix = isEditing ? "edit-" : "";
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor={`${idPrefix}name`}>Product Name</label>
        <Input
          id={`${idPrefix}name`}
          value={product.name || ""}
          onChange={(e) => onProductChange({...product, name: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor={`${idPrefix}description`}>Description</label>
        <Textarea
          id={`${idPrefix}description`}
          value={product.description || ""}
          onChange={(e) => onProductChange({...product, description: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor={`${idPrefix}price`}>Price (NGN)</label>
        <Input
          id={`${idPrefix}price`}
          type="number"
          value={product.price?.toString() || "0"}
          onChange={(e) => onProductChange({...product, price: parseFloat(e.target.value)})}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor={`${idPrefix}category`}>Category</label>
        <Select 
          value={product.category} 
          onValueChange={(value: 'hair' | 'accessories' | 'tools' | 'other') => 
            onProductChange({...product, category: value})
          }
        >
          <SelectTrigger id={`${idPrefix}category`}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hair">Hair Products</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="tools">Tools</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor={`${idPrefix}image`} className="block">Product Image</label>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={imageFile ? URL.createObjectURL(imageFile) : product.image_url} 
              alt="Product preview" 
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          <label htmlFor={`${idPrefix}product-image`} className="cursor-pointer">
            <div className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md">
              <Upload className="h-4 w-4" />
              <span>{isEditing ? "Change Image" : "Upload Image"}</span>
            </div>
            <Input
              id={`${idPrefix}product-image`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onImageChange(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
      </div>
      
      <Button className="w-full" onClick={onSave}>
        {isEditing ? "Update Product" : "Add Product"}
      </Button>
    </div>
  );
};

export default ProductForm;
