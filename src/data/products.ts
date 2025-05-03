
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'hair' | 'accessories' | 'tools' | 'other';
}

export const products: Product[] = [
  {
    id: 1,
    name: "Hair Gel - Ultra Hold",
    description: "Long-lasting hair gel for maximum hold. Perfect for styling and maintaining your look all day.",
    price: 250,
    imageUrl: "/lovable-uploads/824b3e0e-8ed0-4046-8e7d-efcad4bc51cd.png",
    category: 'hair'
  },
  {
    id: 2,
    name: "Premium Styling Comb",
    description: "High-quality styling comb for precision grooming and styling. Durable material for long-lasting use.",
    price: 150,
    imageUrl: "/lovable-uploads/1a564743-278c-411e-b2a1-82bf86a70ec7.png",
    category: 'tools'
  },
  {
    id: 3,
    name: "Hair Twist Sponge",
    description: "Create perfect hair twists and curls with this specialized sponge. Easy to use and effective.",
    price: 200,
    imageUrl: "/lovable-uploads/2a0e716b-063b-4fb2-a96f-cc319f9ea0ce.png",
    category: 'tools'
  },
  {
    id: 4,
    name: "Hair Spray - Medium Hold",
    description: "Medium hold hair spray for flexible styling. Keeps your hair in place while allowing natural movement.",
    price: 275,
    imageUrl: "/lovable-uploads/35a1de13-abca-4df9-bc7e-a02bb9b27f6c.png",
    category: 'hair'
  },
  {
    id: 5,
    name: "Barber Scissors - Stainless Steel",
    description: "Professional stainless steel scissors for precise cutting. Ergonomic design for comfortable handling.",
    price: 450,
    imageUrl: "/lovable-uploads/cc2dae37-b995-437d-bb5f-7ac93acb8898.png",
    category: 'tools'
  },
  {
    id: 6,
    name: "Hair Wax - Matte Finish",
    description: "Matte finish hair wax for natural-looking styles. Easy to apply and wash out.",
    price: 300,
    imageUrl: "/lovable-uploads/41648bb2-a34d-4396-a0ac-ccadcc5d6d62.png",
    category: 'hair'
  },
  {
    id: 7,
    name: "Beard Oil - Natural Ingredients",
    description: "Natural beard oil for softer, healthier beard. Contains essential oils for beard growth and conditioning.",
    price: 325,
    imageUrl: "/lovable-uploads/e38e578c-fada-4af0-8bb6-dac325ebd8e8.png",
    category: 'hair'
  },
  {
    id: 8,
    name: "Hair Clipper - Rechargeable",
    description: "Professional rechargeable hair clipper with multiple combs. Perfect for home haircuts and touch-ups.",
    price: 850,
    imageUrl: "/placeholder.svg",
    category: 'tools'
  }
];
