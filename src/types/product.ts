
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'hair' | 'accessories' | 'tools' | 'other';
}
