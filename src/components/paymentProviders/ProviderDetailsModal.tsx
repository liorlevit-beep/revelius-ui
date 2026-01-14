import { useEffect, useMemo } from 'react';
import { X, Globe, Tag } from 'lucide-react';
import type { Provider } from '../../types/paymentProviders';
import type { ProductCategory } from '../../types/products';
import { getProviderDomain } from '../../data/providerRegions';

interface ProviderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Provider | null;
  categories: ProductCategory[];
}

export function ProviderDetailsModal({ open, onOpenChange, provider, categories }: ProviderDetailsModalProps) {
  // Create category ID to name mapping
  const categoryMap = useMemo(() => {
    console.log('[ProviderDetailsModal] Building category map from categories:', categories);
    const map = new Map<string, string>();
    categories.forEach((cat: any) => {
      // Handle different response formats
      const categoryName = cat.category || cat.name || cat;
      const categoryId = cat.id || cat.category || cat.name || cat;
      
      // Map by ID if it exists
      if (cat.id) {
        map.set(cat.id, categoryName);
      }
      // Map by the category name itself (in case IDs use category names)
      if (typeof categoryName === 'string') {
        map.set(categoryName, categoryName);
      }
      // If it's just a string, map to itself
      if (typeof cat === 'string') {
        map.set(cat, cat);
      }
    });
    console.log('[ProviderDetailsModal] Category map created:', Array.from(map.entries()).slice(0, 5));
    console.log('[ProviderDetailsModal] Total mappings:', map.size);
    return map;
  }, [categories]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  // Generate initials for logo placeholder
  const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate gradient colors based on provider name
  const getGradientColors = (name: string) => {
    const colors = [
      ['from-emerald-400', 'to-emerald-600'],
      ['from-blue-400', 'to-blue-600'],
      ['from-purple-400', 'to-purple-600'],
      ['from-pink-400', 'to-pink-600'],
      ['from-orange-400', 'to-orange-600'],
      ['from-cyan-400', 'to-cyan-600'],
      ['from-indigo-400', 'to-indigo-600'],
      ['from-teal-400', 'to-teal-600'],
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Graceful empty state if provider is null
  if (!provider) {
    return (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => onOpenChange(false)}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8 text-center">
            <p className="text-gray-500">No provider selected</p>
            <button
              onClick={() => onOpenChange(false)}
              className="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const domain = getProviderDomain(provider.key);
  const logoUrl = domain ? `https://logo.clearbit.com/${domain}` : null;
  const [gradientFrom, gradientTo] = getGradientColors(provider.name);
  const regions = provider.regions.length > 0 ? provider.regions : ['Global'];

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors z-10"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 pb-6 border-b border-gray-100">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              {logoUrl ? (
                <div className="w-16 h-16 rounded-xl border-2 border-gray-100 bg-white overflow-hidden flex items-center justify-center">
                  <img 
                    src={logoUrl} 
                    alt={provider.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      // Fallback to gradient initials
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.className = `w-16 h-16 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`;
                        parent.innerHTML = `<span class="text-white text-xl font-bold">${getInitials(provider.name)}</span>`;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`}>
                  <span className="text-white text-xl font-bold">{getInitials(provider.name)}</span>
                </div>
              )}
            </div>

            {/* Title and key */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {provider.name}
              </h2>
              <p className="text-sm text-gray-500 font-mono">
                {provider.key}
              </p>
              {provider.isDefault && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold border border-amber-200 mt-2">
                  Default Compatible
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Regions Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Regions</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <span
                  key={region}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Supported Categories</h3>
              <span className="text-sm text-gray-500">
                ({provider.categoryIds.length})
              </span>
            </div>
            
            {provider.categoryIds.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500 text-center">No categories mapped</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {provider.categoryIds.map((categoryId, index) => {
                    const categoryName = categoryMap.get(categoryId) || categoryId;
                    if (index < 3) {
                      console.log(`[ProviderDetailsModal] Rendering category ${index}:`, {
                        categoryId,
                        categoryName,
                        found: categoryMap.has(categoryId)
                      });
                    }
                    return (
                      <span
                        key={categoryId}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-white text-gray-700 text-xs font-medium border border-gray-200"
                        title={categoryId !== categoryName ? `ID: ${categoryId}` : undefined}
                      >
                        {categoryName}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
