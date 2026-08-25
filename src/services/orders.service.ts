// ─── Orders Service ───────────────────────────────────────────────────────────

import { apiClient } from './api/client';
import type { OrderDto, OrdersResponse, CreateOrderRequest } from '../types/orders.types';

/** GET /orders — todas las órdenes del usuario autenticado, más recientes primero */
export async function getOrders(): Promise<OrdersResponse> {
  const { data } = await apiClient.get<OrdersResponse>('/orders');
  return data;
}

/** POST /orders — crea una orden */
export async function createOrder(payload: CreateOrderRequest): Promise<OrderDto> {
  const { data } = await apiClient.post<OrderDto>('/orders', payload);
  return data;
}

/** GET /orders/:id — detalle de una orden */
export async function getOrderById(id: string): Promise<OrderDto> {
  const { data } = await apiClient.get<OrderDto>(`/orders/${id}`);
  return data;
}
