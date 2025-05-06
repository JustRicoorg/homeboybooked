
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  uploadProductImage 
} from "@/services/productApi";
import AddProductButton from "./products/AddProductButton";
import ProductList from "./products/ProductList";

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    image_url: "/placeholder.svg",
    category: "hair"
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error: any) {
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      // Handle required fields validation
      if (!newProduct.name || !newProduct.description || newProduct.price === undefined || !newProduct.category) {
        throw new Error("Please fill in all required fields");
      }
      
      let imageUrl = newProduct.image_url;
      if (imageFile) {
        const uploadedUrl = await uploadProductImage(imageFile);
        if (uploadedUrl) imageUrl = uploadedUrl;
      }
      
      await createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        image_url: imageUrl || "/placeholder.svg",
        category: newProduct.category as 'hair' | 'accessories' | 'tools' | 'other'
      });
      
      toast({
        title: "Product added",
        description: "The new product has been added successfully"
      });
      
      // Reset form state
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        image_url: "/placeholder.svg",
        category: "hair"
      });
      setImageFile(null);
      
      // Reload products list
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error adding product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async (editedProduct: Product, editImageFile: File | null) => {
    try {
      let imageUrl;
      if (editImageFile) {
        imageUrl = await uploadProductImage(editImageFile);
      }
      
      await updateProduct(
        editedProduct.id, 
        editedProduct,
        imageUrl || undefined
      );
      
      toast({
        title: "Product updated",
        description: "The product has been updated successfully"
      });
      
      // Reload products list
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await deleteProduct(id);
      
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully"
      });
      
      // Reload products list
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <AddProductButton
          newProduct={newProduct}
          imageFile={imageFile}
          onNewProductChange={setNewProduct}
          onImageChange={setImageFile}
          onAddProduct={handleAddProduct}
        />
      </div>
      
      <ProductList
        products={products}
        loading={loading}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
};

export default AdminProducts;
