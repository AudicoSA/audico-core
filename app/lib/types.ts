
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  pricelist_id: string;
  cost_price: number;
  retail_price: number;
  markup_percentage: number;
  is_active: boolean;
  created_at: string;
  embedding?: string;
  content?: string;
}

export interface Quote {
  id: string;
  session_id: string;
  category_id: string;
  status: string;
  total_amount: number;
  customer_email?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  added_at: string;
}

export interface ChatSession {
  id: string;
  session_id: string;
  category_id: string;
  message_type: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface MarketCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
