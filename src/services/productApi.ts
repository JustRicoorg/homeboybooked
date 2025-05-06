
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');
  
  if (error) throw error;
  return data || [];
}

export async function updateProduct(
  id: number, 
  productData: Partial<Product>, 
  imageUrl?: string
): Promise<void> {
  if (!productData.name || !productData.description || productData.price === undefined || !productData.category) {
    throw new Error("Please fill in all required fields");
  }
  
  const updateData = {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    category: productData.category,
    ...(imageUrl && { image_url: imageUrl }),
  };
  
  const { error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id);
  
  if (error) throw error;
}

export async function createProduct(
  productData: Omit<Product, "id">, 
  imageUrl?: string
): Promise<void> {
  if (!productData.name || !productData.description || productData.price === undefined || !productData.category) {
    throw new Error("Please fill in all required fields");
  }
  
  const insertData = {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    category: productData.category,
    image_url: imageUrl || productData.image_url
  };
  
  const { error } = await supabase
    .from('products')
    .insert(insertData);
  
  if (error) throw error;
}

export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function uploadProductImage(file: File): Promise<string | null> {
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
    console.error("Error uploading image:", error);
    return null;
  }
}
