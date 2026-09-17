export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  details: string[];
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}
