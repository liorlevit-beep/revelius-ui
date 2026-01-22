/**
 * Provider Categories CMS Data Layer
 * 
 * Handles types, validation, normalization, and persistence for the
 * Provider Categories CMS page.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface CanonicalCategory {
  id: string;
  category?: string;
  title?: string;
  mcc_code?: string;
}

export interface ProviderCategory {
  id: string;
  region: 'Global';
  title: string;
}

export interface ProviderMapping {
  id: string;
  payment_provider: string;
  categories: ProviderCategory[];
}

export interface ProviderCategoriesData {
  data: ProviderMapping[];
  error: null;
  status_code: 200;
  success: true;
}

export interface ValidationError {
  providerId: string;
  providerName: string;
  type: 'duplicate' | 'unknown_id' | 'missing_provider_id' | 'invalid_region';
  message: string;
  categoryId?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const LOCALSTORAGE_KEY = 'pp_category_cms_v1';

// ============================================================================
// NORMALIZATION
// ============================================================================

/**
 * Normalize a provider's categories:
 * - Ensure all regions are "Global"
 * - Match titles to canonical titles by ID
 * - Remove duplicates by category ID
 * - Order by canonical category order
 */
export function normalizeProviderCategories(
  provider: ProviderMapping,
  canonicalCategories: CanonicalCategory[]
): ProviderMapping {
  const categoryMap = new Map<string, CanonicalCategory>();
  canonicalCategories.forEach(cat => {
    categoryMap.set(cat.id, cat);
  });

  // Remove duplicates and normalize
  const seen = new Set<string>();
  const normalized: ProviderCategory[] = [];

  for (const cat of provider.categories) {
    // Skip if duplicate
    if (seen.has(cat.id)) continue;
    seen.add(cat.id);

    // Get canonical category
    const canonical = categoryMap.get(cat.id);
    if (!canonical) continue; // Skip unknown categories

    // Normalize
    normalized.push({
      id: cat.id,
      region: 'Global',
      title: canonical.title || canonical.category || cat.title,
    });
  }

  // Sort by canonical order
  normalized.sort((a, b) => {
    const aIndex = canonicalCategories.findIndex(c => c.id === a.id);
    const bIndex = canonicalCategories.findIndex(c => c.id === b.id);
    return aIndex - bIndex;
  });

  return {
    ...provider,
    categories: normalized,
  };
}

/**
 * Normalize all providers in the data structure
 */
export function normalizeAllProviders(
  data: ProviderCategoriesData,
  canonicalCategories: CanonicalCategory[]
): ProviderCategoriesData {
  return {
    ...data,
    data: data.data.map(provider => 
      normalizeProviderCategories(provider, canonicalCategories)
    ),
  };
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate provider category mappings
 * Returns array of validation errors (empty if valid)
 */
export function validateMapping(
  data: ProviderCategoriesData,
  canonicalCategories: CanonicalCategory[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  const canonicalIds = new Set(canonicalCategories.map(c => c.id));

  for (const provider of data.data) {
    // Check provider has ID
    if (!provider.id) {
      errors.push({
        providerId: provider.id || 'unknown',
        providerName: provider.payment_provider,
        type: 'missing_provider_id',
        message: `Provider "${provider.payment_provider}" is missing an ID`,
      });
    }

    // Check for duplicates
    const seen = new Set<string>();
    for (const cat of provider.categories) {
      if (seen.has(cat.id)) {
        errors.push({
          providerId: provider.id,
          providerName: provider.payment_provider,
          type: 'duplicate',
          message: `Duplicate category "${cat.title}" (${cat.id})`,
          categoryId: cat.id,
        });
      }
      seen.add(cat.id);

      // Check for unknown category IDs
      if (!canonicalIds.has(cat.id)) {
        errors.push({
          providerId: provider.id,
          providerName: provider.payment_provider,
          type: 'unknown_id',
          message: `Unknown category ID "${cat.id}"`,
          categoryId: cat.id,
        });
      }

      // Check region is Global
      if (cat.region !== 'Global') {
        errors.push({
          providerId: provider.id,
          providerName: provider.payment_provider,
          type: 'invalid_region',
          message: `Category "${cat.title}" has region "${cat.region}" (must be "Global")`,
          categoryId: cat.id,
        });
      }
    }
  }

  return errors;
}

// ============================================================================
// LOCALSTORAGE PERSISTENCE
// ============================================================================

/**
 * Save provider categories data to localStorage
 */
export function saveToLocalStorage(data: ProviderCategoriesData): void {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('[ProviderCategoriesCMS] Failed to save to localStorage:', error);
    throw new Error('Failed to save data');
  }
}

/**
 * Load provider categories data from localStorage
 * Returns null if not found or invalid
 */
export function loadFromLocalStorage(): ProviderCategoriesData | null {
  try {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored) as ProviderCategoriesData;
    
    // Basic validation
    if (!data.data || !Array.isArray(data.data)) {
      console.warn('[ProviderCategoriesCMS] Invalid data structure in localStorage');
      return null;
    }

    return data;
  } catch (error) {
    console.error('[ProviderCategoriesCMS] Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Clear localStorage data
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(LOCALSTORAGE_KEY);
  } catch (error) {
    console.error('[ProviderCategoriesCMS] Failed to clear localStorage:', error);
  }
}

// ============================================================================
// JSON EXPORT
// ============================================================================

/**
 * Download data as JSON file
 */
export function downloadJSON(data: ProviderCategoriesData, filename: string = 'provider_categories.json'): void {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('[ProviderCategoriesCMS] Failed to download JSON:', error);
    throw new Error('Failed to download JSON file');
  }
}

/**
 * Copy JSON to clipboard
 */
export async function copyToClipboard(data: any): Promise<void> {
  try {
    const json = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(json);
  } catch (error) {
    console.error('[ProviderCategoriesCMS] Failed to copy to clipboard:', error);
    throw new Error('Failed to copy to clipboard');
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get a single provider by ID
 */
export function getProviderById(
  data: ProviderCategoriesData,
  providerId: string
): ProviderMapping | null {
  return data.data.find(p => p.id === providerId) || null;
}

/**
 * Update a provider's categories
 */
export function updateProviderCategories(
  data: ProviderCategoriesData,
  providerId: string,
  categories: ProviderCategory[]
): ProviderCategoriesData {
  return {
    ...data,
    data: data.data.map(provider =>
      provider.id === providerId
        ? { ...provider, categories }
        : provider
    ),
  };
}

/**
 * Add a category to a provider (if not already present)
 */
export function addCategoryToProvider(
  data: ProviderCategoriesData,
  providerId: string,
  categoryId: string,
  canonicalCategories: CanonicalCategory[]
): ProviderCategoriesData {
  const provider = getProviderById(data, providerId);
  if (!provider) return data;

  // Check if already exists
  if (provider.categories.some(c => c.id === categoryId)) {
    return data;
  }

  // Find canonical category
  const canonical = canonicalCategories.find(c => c.id === categoryId);
  if (!canonical) return data;

  // Add category
  const newCategories: ProviderCategory[] = [
    ...provider.categories,
    {
      id: categoryId,
      region: 'Global',
      title: canonical.title || canonical.category || categoryId,
    },
  ];

  // Normalize and return
  const updatedProvider = normalizeProviderCategories(
    { ...provider, categories: newCategories },
    canonicalCategories
  );

  return updateProviderCategories(data, providerId, updatedProvider.categories);
}

/**
 * Remove a category from a provider
 */
export function removeCategoryFromProvider(
  data: ProviderCategoriesData,
  providerId: string,
  categoryId: string
): ProviderCategoriesData {
  const provider = getProviderById(data, providerId);
  if (!provider) return data;

  const newCategories = provider.categories.filter(c => c.id !== categoryId);
  return updateProviderCategories(data, providerId, newCategories);
}

/**
 * Clear all categories from a provider
 */
export function clearProviderCategories(
  data: ProviderCategoriesData,
  providerId: string
): ProviderCategoriesData {
  return updateProviderCategories(data, providerId, []);
}

/**
 * Add all categories to a provider
 */
export function addAllCategoriesToProvider(
  data: ProviderCategoriesData,
  providerId: string,
  canonicalCategories: CanonicalCategory[]
): ProviderCategoriesData {
  const provider = getProviderById(data, providerId);
  if (!provider) return data;

  const allCategories: ProviderCategory[] = canonicalCategories.map(canonical => ({
    id: canonical.id,
    region: 'Global',
    title: canonical.title || canonical.category || canonical.id,
  }));

  return updateProviderCategories(data, providerId, allCategories);
}
