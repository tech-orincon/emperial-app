// ─── Orders DTOs (backend snapshots) ─────────────────────────────────────────

export type OrderStatus = 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

export interface OrderServiceSnapshot {
  id: number;
  title: string;
  imageUrl?: string | null;
}

export interface OrderPackageSnapshot {
  id: number;
  name: string;
  price: string;
}

export interface OrderAddonSnapshot {
  id: number;
  name: string;
  price: string;
}

export interface OrderProviderSnapshot {
  id: number;
  username: string;
  avatarUrl?: string | null;
}

export interface OrderDto {
  id: number;
  status: OrderStatus;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  service: OrderServiceSnapshot;
  package: OrderPackageSnapshot;
  addons: OrderAddonSnapshot[];
  provider?: OrderProviderSnapshot | null;
}

export interface OrdersResponse {
  data: OrderDto[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateOrderRequest {
  serviceId: number;
  packageId: number;
  addonIds: number[];
}
