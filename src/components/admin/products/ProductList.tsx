
import React, { useState } from "react";
import { Product } from "@/types/product";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ProductForm from "./ProductForm";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onEditProduct: (product: Product, imageFile: File | null) => void;
  onDeleteProduct: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  loading, 
  onEditProduct, 
  onDeleteProduct 
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const handleSaveEdit = () => {
    if (editingProduct) {
      onEditProduct(editingProduct, editImageFile);
      setEditingProduct(null);
      setEditImageFile(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">No products found</TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="h-12 w-12 rounded overflow-hidden">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell className="capitalize">{product.category}</TableCell>
                <TableCell>₦{product.price}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setEditingProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Edit Product</SheetTitle>
                        </SheetHeader>
                        {editingProduct && (
                          <div className="mt-6">
                            <ProductForm
                              product={editingProduct}
                              isEditing={true}
                              imageFile={editImageFile}
                              onProductChange={setEditingProduct}
                              onImageChange={setEditImageFile}
                              onSave={handleSaveEdit}
                            />
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => onDeleteProduct(product.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;
