export type OrderStatus = 'queued' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  serviceId: string;
  serviceTitle: string;
  status: OrderStatus;
  price: number;
  createdAt: string;
  updatedAt: string;
  providerId?: string;
  providerName?: string;
}

export interface OrderDetail extends Order {
  tierId: string;
  tierName: string;
  addons: string[];
  characterDetails: Record<string, string>;
  timeline: OrderEvent[];
}

export interface OrderEvent {
  id: string;
  label: string;
  description: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}
