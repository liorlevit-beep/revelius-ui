/**
 * Payment Providers types
 */

export type ProviderKey = string;

export type ProviderRegion = 
  | "Global"
  | "North America"
  | "Europe"
  | "United Kingdom"
  | "Israel"
  | "LATAM"
  | "APAC"
  | "Africa & Middle East";

export interface ProviderMappingResponse {
  data: {
    created_timestamp: number;
    updated_timestamp: number;
    default_psp: string;
    mapping: Record<ProviderKey, string[]>;
  };
  success: boolean;
  status_code: number;
  error: any;
}

export interface Provider {
  key: ProviderKey;
  name: string;
  regions: ProviderRegion[];
  categoryIds: string[];
  isDefault: boolean;
  website?: string;
  logoKey?: string;
}
