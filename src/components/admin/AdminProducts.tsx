import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Trash, Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Define our Product interface to match the database structure
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Product>({
    id: 0, // This will be ignored when inserting
    name: "",
    description: "",
    price: 0,
    image_url: "/placeholder.svg",
    category: "hair"
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');
      
      if (error) throw error;
      setProducts(data || []);
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

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = await supabase
        .storage
        .from('images')
        .getPublicUrl(filePath);
      
      if (!urlData?.publicUrl) throw new Error("Failed to get public URL");
      
      return urlData.publicUrl;
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSaveProduct = async () => {
    try {
      let imageUrl;
      
      if (editingProduct) {
        // Handle update
        if (editImageFile) {
          imageUrl = await uploadImage(editImageFile);
          if (!imageUrl) return;
        }
        
        const { error } = await supabase
          .from('products')
          .update({
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price,
            category: editingProduct.category,
            ...(imageUrl && { image_url: imageUrl }),
          })
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        
        toast({
          title: "Product updated",
          description: "The product has been updated successfully"
        });
      } else {
        // Handle create - Fix: Ensure all required fields are provided
        if (imageFile) {
          imageUrl = await uploadImage(imageFile);
          if (!imageUrl) return;
        }
        
        const { error } = await supabase
          .from('products')
          .insert({
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            category: newProduct.category,
            image_url: imageUrl || newProduct.image_url
          });
        
        if (error) throw error;
        
        toast({
          title: "Product added",
          description: "The new product has been added successfully"
        });
        
        setNewProduct({
          id: 0,
          name: "",
          description: "",
          price: 0,
          image_url: "/placeholder.svg",
          category: "hair"
        });
        setImageFile(null);
      }
      
      fetchProducts();
      setEditingProduct(null);
      setEditImageFile(null);
    } catch (error: any) {
      toast({
        title: "Error saving product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully"
      });
      
      fetchProducts();
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
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <label htmlFor="name">Product Name</label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price">Price (NGN)</label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price?.toString() || "0"}
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category">Category</label>
                <Select 
                  value={newProduct.category} 
                  onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                >
                  <SelectTrigger>
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
                <label htmlFor="image" className="block">Product Image</label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : newProduct.image_url} 
                      alt="Product preview" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <label htmlFor="product-image" className="cursor-pointer">
                    <div className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md">
                      <Upload className="h-4 w-4" />
                      <span>Upload Image</span>
                    </div>
                    <Input
                      id="product-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <Button className="w-full" onClick={handleSaveProduct}>
                Add Product
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
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
                            <div className="space-y-4 mt-6">
                              <div className="space-y-2">
                                <label htmlFor="edit-name">Product Name</label>
                                <Input
                                  id="edit-name"
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-description">Description</label>
                                <Textarea
                                  id="edit-description"
                                  value={editingProduct.description}
                                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-price">Price (NGN)</label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  value={editingProduct.price.toString()}
                                  onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-category">Category</label>
                                <Select 
                                  value={editingProduct.category} 
                                  onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}
                                >
                                  <SelectTrigger>
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
                                <label htmlFor="edit-image" className="block">Product Image</label>
                                <div className="flex items-center gap-4">
                                  <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                                    <img 
                                      src={editImageFile ? URL.createObjectURL(editImageFile) : editingProduct.image_url} 
                                      alt="Product preview" 
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                      }}
                                    />
                                  </div>
                                  <label htmlFor="edit-product-image" className="cursor-pointer">
                                    <div className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md">
                                      <Upload className="h-4 w-4" />
                                      <span>Change Image</span>
                                    </div>
                                    <Input
                                      id="edit-product-image"
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          setEditImageFile(e.target.files[0]);
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                              <Button className="w-full" onClick={handleSaveProduct}>
                                Update Product
                              </Button>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product.id)}>
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
    </div>
  );
};

export default AdminProducts;
