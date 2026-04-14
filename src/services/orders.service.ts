/* eslint-disable @typescript-eslint/no-unused-vars */
// ─── Orders Service ───────────────────────────────────────────────────────────
//
// Backend integration points for order lifecycle management.
// Replace mock implementations with real API calls.

import type { Order, OrderDetail } from '../types/orders.types';

// TODO: Replace with real API call → GET /orders
export async function getOrders(): Promise<Order[]> {
  throw new Error('orders.service.getOrders: not implemented');
}

// TODO: Replace with real API call → GET /orders/:id
export async function getOrderById(_id: string): Promise<OrderDetail> {
  throw new Error('orders.service.getOrderById: not implemented');
}

// TODO: Replace with real API call → POST /orders
export async function createOrder(_payload: {
  serviceId: string;
  tierId: string;
  addons: string[];
  characterDetails: Record<string, string>;
}): Promise<Order> {
  throw new Error('orders.service.createOrder: not implemented');
}

// TODO: Replace with real API call → POST /orders/:id/refund
export async function requestRefund(_orderId: string, _reason: string): Promise<void> {
  throw new Error('orders.service.requestRefund: not implemented');
}
