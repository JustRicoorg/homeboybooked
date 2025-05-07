
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import ProductForm from "./ProductForm";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSaveEdit = () => {
    if (editingProduct) {
      onEditProduct(editingProduct, editImageFile);
      setEditingProduct(null);
      setEditImageFile(null);
      setDialogOpen(false);
    }
  };

  // Function to handle product change in the form
  const handleProductChange = (product: Partial<Product>) => {
    if (editingProduct && product) {
      setEditingProduct({
        ...editingProduct,
        ...product
      });
    }
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setEditingProduct(null);
          setEditImageFile(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="mt-6">
              <ProductForm
                product={editingProduct}
                isEditing={true}
                imageFile={editImageFile}
                onProductChange={handleProductChange}
                onImageChange={setEditImageFile}
                onSave={handleSaveEdit}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            {!isMobile && <TableHead>Category</TableHead>}
            <TableHead>Price</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 4 : 5} className="text-center py-8">Loading...</TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 4 : 5} className="text-center py-8">No products found</TableCell>
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
                {!isMobile && <TableCell className="capitalize">{product.category}</TableCell>}
                <TableCell>D{product.price}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="default" onClick={() => {
                      setEditingProduct(product);
                      setDialogOpen(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
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
