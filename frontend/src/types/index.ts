export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  category: string | Category;
  description?: string;
  price: number;
  image: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QrCode {
  _id: string;
  location: string | Location;
  label: string;
  qrCodeUrl: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  subcategory: string | Subcategory;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string | User;
  location: string | Location;
  items: OrderItem[];
  totalPrice: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
