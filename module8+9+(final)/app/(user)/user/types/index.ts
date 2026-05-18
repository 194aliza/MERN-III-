// types/index.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  category?: string;
}

export interface CartItem {
  productId: number;
  qty: number;
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string | Record<string, string[]>;
};