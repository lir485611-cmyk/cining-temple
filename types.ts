
export interface Product {
  product_id: string;
  name: string;
  category: string;
  price: number;
  original_price: number;
  stock: number;
  image_url: string;
  description: string;
  detail_content: string;
  spec: string;
  status: 'Active' | 'Inactive';
}

export interface Member {
  member_id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  gender?: string;
  birthday?: string;
  member_level: string;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  order_id: string;
  member_id: string;
  order_date: string;
  total_amount: number;
  items_json: string; // JSON string of OrderItem[]
  shipping_status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_status: 'Paid' | 'Unpaid';
  receiver_name: string;
  receiver_phone: string;
  shipping_address: string;
}

export interface CartItem extends Product {
  quantity: number;
}
