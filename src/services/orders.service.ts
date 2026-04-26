// ─── Orders Service ───────────────────────────────────────────────────────────

import { apiClient } from './api/client';
import type { OrderDto, OrdersResponse, CreateOrderRequest } from '../types/orders.types';

/** GET /orders — paginated list of the authenticated user's orders */
export async function getOrders(page = 1, limit = 20): Promise<OrdersResponse> {
  const { data } = await apiClient.get<OrdersResponse>('/orders', { params: { page, limit } });
  return data;
}

/** POST /orders — create a single order */
export async function createOrder(payload: CreateOrderRequest): Promise<OrderDto> {
  const { data } = await apiClient.post<OrderDto>('/orders', payload);
  return data;
}

/** GET /orders/:id — single order detail */
export async function getOrderById(id: string): Promise<OrderDto> {
  const { data } = await apiClient.get<OrderDto>(`/orders/${id}`);
  return data;
}
