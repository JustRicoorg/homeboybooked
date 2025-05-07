
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchProducts } from "@/services/productApi";
import { Product } from "@/types/product";

const Products = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  // Filter products based on selected category
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory) 
    : products;

  const handleBuyNow = (product: Product) => {
    // Replace with actual WhatsApp number
    const whatsappNumber = "+2207548163"; 
    const message = `Hello, I'm interested in buying the ${product.name} for D${product.price}.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
    
    // Show toast notification
    toast({
      title: "Redirecting to WhatsApp",
      description: "You're being connected with our sales team.",
    });
  };

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'hair', name: 'Hair Products' },
    { id: 'tools', name: 'Tools' },
    { id: 'accessories', name: 'Accessories' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onBookNow={() => {}} />
      
      {/* Hero Section */}
      <section className="bg-[#1A1F2C] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Our Products</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Complete your look with our premium barber products. From styling gels to professional tools, we've got everything you need.
          </p>
        </div>
      </section>
      
      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id || (category.id === 'all' && !selectedCategory) ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
                className="min-w-[120px]"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-10">
              <p className="text-lg">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-10">
                  <p className="text-lg">No products found in this category.</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">D{product.price}</span>
                        <Button 
                          onClick={() => handleBuyNow(product)}
                          className="gap-1"
                        >
                          <ShoppingBag size={16} />
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="mb-6">Contact our team for recommendations on the best products for your hair type and style.</p>
          <Button className="gap-2" size="lg">
            <Phone size={16} />
            Contact Us
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Products;
