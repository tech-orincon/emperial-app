// ─── Reference / Catalog DTOs ─────────────────────────────────────────────────

export interface CountryDto {
  id: number;
  name: string;
  isoCode: string;
  currencyCode: string;
}

export interface TimezoneDto {
  id: number;
  /** Value sent to the backend (e.g. "America/Bogota") */
  name: string;
  /** Human-readable label (e.g. "COT (UTC-5)") */
  label: string;
  utcOffset: string;
  region: string;
}

export interface GameDto {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  icon?: string;
  tags: string[];
  isComingSoon?: boolean;
}

export interface GameAttributeOptionDto {
  id: number;
  value: string;
  label: string;
}

export interface GameAttributeDto {
  id: number;
  /** Field identifier used as key in the data object sent to the backend */
  key: string;
  label: string;
  inputType: 'TEXT' | 'NUMBER' | 'SELECT' | 'MULTI_SELECT';
  isRequired: boolean;
  displayOrder: number;
  /** Populated only for SELECT and MULTI_SELECT fields */
  options: GameAttributeOptionDto[];
}

export interface GameCategoryDto {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
}
