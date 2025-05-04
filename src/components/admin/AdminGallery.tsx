
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash, Upload } from "lucide-react";

const AdminGallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('id');
      
      if (error) throw error;
      setImages((data || []).map((item: any) => item.image_url));
    } catch (error: any) {
      toast({
        title: "Error fetching gallery",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;
      
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded image
      const { data: urlData } = await supabase
        .storage
        .from('images')
        .getPublicUrl(filePath);
      
      if (!urlData?.publicUrl) throw new Error("Failed to get public URL");
      
      // Save image URL to the database
      const { error: dbError } = await supabase
        .from('gallery')
        .insert([{ image_url: urlData.publicUrl }]);
      
      if (dbError) throw dbError;
      
      toast({
        title: "Image uploaded",
        description: "The image has been added to the gallery successfully"
      });
      
      fetchImages();
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the input
      e.target.value = "";
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      // Extract the path from the URL
      const path = imageUrl.substring(imageUrl.indexOf('images/') + 7);
      
      // Delete from storage
      const { error: storageError } = await supabase
        .storage
        .from('images')
        .remove([`gallery/${path}`]);
      
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('image_url', imageUrl);
      
      if (dbError) throw dbError;
      
      toast({
        title: "Image deleted",
        description: "The image has been removed from the gallery successfully"
      });
      
      fetchImages();
    } catch (error: any) {
      toast({
        title: "Error deleting image",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Gallery</h2>
        <div>
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
              <Upload className="h-4 w-4" />
              <span>{uploading ? "Uploading..." : "Upload Image"}</span>
            </div>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadImage}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.length === 0 ? (
            <div className="col-span-full text-center py-8">No images in the gallery</div>
          ) : (
            images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img 
                  src={imageUrl} 
                  alt={`Gallery image ${index + 1}`} 
                  className="w-full aspect-square object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDeleteImage(imageUrl)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
