
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash, Upload } from "lucide-react";

interface GalleryImage {
  id: number;
  image_url: string;
  created_at?: string;
}

const AdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      // Fixed TypeScript error by using the correct table name
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('id');
      
      if (error) throw error;
      setImages(data || []);
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
        .insert({ image_url: urlData.publicUrl });
      
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

  const handleDeleteImage = async (imageId: number, imageUrl: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      // Delete from database first
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', imageId);
      
      if (dbError) throw dbError;
      
      // Try to extract the path from the URL and delete from storage if possible
      try {
        if (imageUrl.includes('gallery/')) {
          const path = imageUrl.substring(imageUrl.indexOf('gallery/'));
          await supabase.storage.from('images').remove([path]);
        }
      } catch (storageError) {
        console.error("Failed to delete from storage:", storageError);
        // Don't fail if storage deletion fails
      }
      
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
            images.map((image) => (
              <div key={image.id} className="relative group">
                <img 
                  src={image.image_url} 
                  alt={`Gallery image ${image.id}`} 
                  className="w-full aspect-square object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => handleDeleteImage(image.id, image.image_url)}
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
