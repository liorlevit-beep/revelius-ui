import { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Package, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch, ApiError } from '../api';
import { categoryExamples } from '../data/categoryExamples';

interface Category {
  category: string;
  mcc_code: string;
  region: string;
}

interface CategoryResponse {
  success: boolean;
  status_code: number;
  error: string | null;
  data: Category[];
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFetch<CategoryResponse>('/scanner/categories');
        
        if (response.success && response.data) {
          console.log('Categories from API:', response.data);
          console.log('Available example mappings:', Object.keys(categoryExamples));
          setCategories(response.data);
        } else {
          setError(response.error || 'Failed to load categories');
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Get unique regions for filter
  const regions = useMemo(() => {
    const uniqueRegions = new Set(categories.map((cat) => cat.region));
    return ['All', ...Array.from(uniqueRegions).sort()];
  }, [categories]);

  // Filter categories based on search and region
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Region filter
      if (selectedRegion !== 'All' && cat.region !== selectedRegion) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesCategory = cat.category.toLowerCase().includes(query);
        const matchesMcc = cat.mcc_code.toLowerCase().includes(query);
        
        // Search in examples too
        const examples = categoryExamples[cat.category]?.examples || [];
        const matchesExamples = examples.some((ex) =>
          ex.toLowerCase().includes(query)
        );

        return matchesCategory || matchesMcc || matchesExamples;
      }

      return true;
    });
  }, [categories, searchQuery, selectedRegion]);

  // Loading state
  if (loading) {
    return (
      <div className="h-full overflow-auto bg-slate-50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto p-8">
          {/* Skeleton loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-lg border border-slate-200 dark:border-white/10 p-6 animate-pulse">
                <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-20"></div>
                  <div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full overflow-auto bg-slate-50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto p-8">
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">Failed to Load Categories</h3>
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-slate-50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto p-8">
        {/* Toolbar */}
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-lg border border-slate-200 dark:border-white/10 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search categories, MCC codes, or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Region Filter */}
            <div className="relative sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 pointer-events-none" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none [&>option]:bg-white [&>option]:dark:bg-gray-900"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region === 'All' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-slate-600 dark:text-gray-400">
            {filteredCategories.length === categories.length ? (
              <span>{categories.length} total categories</span>
            ) : (
              <span>
                {filteredCategories.length} of {categories.length} categories
              </span>
            )}
          </div>
        </div>

        {/* Empty state */}
        {filteredCategories.length === 0 && (
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-lg border border-slate-200 dark:border-white/10 p-12 text-center">
            <Package className="w-12 h-12 text-slate-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No categories found</h3>
            <p className="text-slate-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Category Grid */}
        {filteredCategories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => {
              const examples = categoryExamples[cat.category];
              const hasExamples = examples && examples.examples.length > 0;
              
              // Debug: log if no match found
              if (!examples) {
                console.log('No examples found for category:', cat.category);
              }

              return (
                <div
                  key={`${cat.category}-${cat.mcc_code}-${cat.region}`}
                  className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-lg border border-slate-200 dark:border-white/10 p-6 hover:shadow-md dark:hover:bg-white/10 transition-all"
                >
                  {/* Category Name */}
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    {cat.category}
                  </h3>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                      MCC: {cat.mcc_code}
                    </span>
                    <span className="px-2.5 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-full">
                      {cat.region}
                    </span>
                  </div>

                  {/* Description */}
                  {examples?.description && (
                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">{examples.description}</p>
                  )}

                  {/* Divider */}
                  <div className="border-t border-slate-200 dark:border-white/10 my-4"></div>

                  {/* Example Products */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Example Products
                    </h4>
                    {hasExamples ? (
                      <ul className="space-y-1.5">
                        {examples.examples.map((example, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-slate-600 dark:text-gray-400 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-emerald-500 dark:before:text-emerald-400"
                          >
                            {example}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400 dark:text-gray-500 italic">Examples coming soon</p>
                    )}
                  </div>

                  {/* Footer note */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
                    <p className="text-xs text-slate-500 dark:text-gray-500">
                      Used for routing & compliance
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
