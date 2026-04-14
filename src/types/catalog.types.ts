export interface Game {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  isAvailable: boolean;
}

export interface Category {
  id: string;
  gameId: string;
  label: string;
  description: string;
  iconName: string;
}

export interface ServiceTier {
  id: string;
  name: 'Basic' | 'Standard' | 'Premium';
  price: number;
  features: string[];
  duration: string;
}

export interface Service {
  id: string;
  gameId: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  completionTime: string;
  tiers: ServiceTier[];
  addons: ServiceAddon[];
  tags: string[];
}

export interface ServiceAddon {
  id: string;
  label: string;
  price: number;
}
