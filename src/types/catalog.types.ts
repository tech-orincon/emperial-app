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

// ─── Catalog API ─────────────────────────────────────────────────────────────

export interface GameCategoryResponseDto {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  imageUrl?: string | null;
  countServices: number;
  isComingSoon?: boolean;
}

export interface ServiceOfferDto {
  id: number;
  title?: string | null;
  discountPct?: number | null;
  originalPrice?: string | null;
  finalPrice: string;
  tag?: OfferTag | null;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface CategoryServiceResponseDto {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  ratingAvg: number;
  reviewsCount: number;
  isBestSeller: boolean;
  isInstant: boolean;
  deliveryType: 'FIXED' | 'RANGE' | 'FLEXIBLE' | 'SCHEDULED';
  deliveryTime?: string | null;
  basePrice: string;
  estimatedTime: string;
  isActive: boolean;
  isFeatured: boolean;
  serviceOffers: ServiceOfferDto[];
}

// ─── Home API ────────────────────────────────────────────────────────────────

export interface HomeGame {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  icon: string | null;
  tags: string[];
  countServices: number;
}

export type OfferTag = 'BEST_VALUE' | 'POPULAR' | 'FLASH_SALE' | 'LIMITED';

export interface HomeOffer {
  id: number;
  title: string | null;
  description: string;
  imageUrl: string | null;
  ratingAvg: number;
  reviewsCount: number;
  finalPrice: string;
  originalPrice: string | null;
  discountPct: string | null;
  tag: OfferTag | null;
  startsAt: string | null;
  endsAt: string | null;
}

export interface HomeData {
  games: HomeGame[];
  offers: HomeOffer[];
}

// ─── Service Detail ───────────────────────────────────────────────────────────

export type ServiceStatus = 'ACTIVE' | 'INACTIVE';
export type DeliveryType = 'FIXED' | 'RANGE' | 'FLEXIBLE' | 'SCHEDULED';

export interface ServicePackageDto {
  id: number;
  name: string;
  price: string;
  isPopular: boolean;
  features: string[];
  displayOrder: number;
}

export interface ServiceAddonDetailDto {
  id: number;
  name: string;
  price: string;
  description?: string | null;
}

export interface ServiceRequirementDto {
  id: number;
  title: string;
  description: string;
  displayOrder: number;
}

export interface RatingBreakdownDto {
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
}

export interface ServiceActiveOfferDto {
  finalPrice: string;
  originalPrice?: string | null;
  discountPct?: number | null;
  tag?: OfferTag | null;
}

export interface ServiceProviderDto {
  id: number;
  username: string;
  avatarUrl?: string | null;
  ratingAvg: number;
  completedJobs: number;
  isVerified: boolean;
}

export interface ServiceDetail {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  ratingAvg: number;
  reviewsCount: number;
  deliveryTime?: string | null;
  deliveryType: DeliveryType;
  badges: string[];
  game: { id: number; name: string; slug: string };
  category: { id: number; name: string; slug: string };
  features: string[];
  requirements: ServiceRequirementDto[];
  packages: ServicePackageDto[];
  addons: ServiceAddonDetailDto[];
  ratingBreakdown: RatingBreakdownDto;
  activeOffer?: ServiceActiveOfferDto | null;
  provider: ServiceProviderDto | null;
  status: ServiceStatus;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: number;
  customerUsername: string;
  customerAvatarInitials: string;
  customerAvatarUrl?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsResponse {
  data: Review[];
  total: number;
  page: number;
  limit: number;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  serviceId: number;
  packageId: number;
  addons: number[];
  totalPrice: number;
}
