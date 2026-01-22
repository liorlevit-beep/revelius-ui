import { useState, useEffect, useMemo } from 'react';
import { Search, Download, Save, RotateCcw, Copy, X, Plus, Trash2, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { 
  DndContext, 
  DragOverlay, 
  closestCenter, 
  PointerSensor, 
  useSensor, 
  useSensors,
  type DragEndEvent,
  type DragStartEvent 
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTheme } from '../contexts/ThemeContext';
import { ProductsAPI } from '../api';
import type { ProductCategory } from '../types/products';
import {
  type ProviderCategoriesData,
  type ProviderMapping,
  type CanonicalCategory,
  type ValidationError,
  normalizeAllProviders,
  validateMapping,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  downloadJSON,
  copyToClipboard,
  addCategoryToProvider,
  removeCategoryFromProvider,
  clearProviderCategories,
  addAllCategoriesToProvider,
} from '../lib/cms/providerCategoriesCMS';

export function ProviderCategoriesCMS() {
  const { darkMode } = useTheme();
  
  // State
  const [data, setData] = useState<ProviderCategoriesData | null>(null);
  const [canonicalCategories, setCanonicalCategories] = useState<CanonicalCategory[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<CanonicalCategory | null>(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch canonical categories and routing table
        const [categoriesRes, routingTableRes] = await Promise.all([
          ProductsAPI.getCategories(),
          ProductsAPI.getRoutingTable(),
        ]);

        // Parse canonical categories
        let parsedCategories: CanonicalCategory[] = [];
        if (categoriesRes.success && categoriesRes.data) {
          if (Array.isArray(categoriesRes.data)) {
            parsedCategories = categoriesRes.data.map((cat: any) => ({
              id: cat.id,
              title: cat.title || cat.category || cat.name,
              category: cat.category || cat.title,
              mcc_code: cat.mcc_code,
            }));
          } else if (categoriesRes.data.categories && Array.isArray(categoriesRes.data.categories)) {
            parsedCategories = categoriesRes.data.categories.map((cat: any) => ({
              id: cat.id,
              title: cat.title || cat.category || cat.name,
              category: cat.category || cat.title,
              mcc_code: cat.mcc_code,
            }));
          }
        }
        setCanonicalCategories(parsedCategories);

        // Parse routing table into provider mappings
        let initialData: ProviderCategoriesData | null = null;
        
        // Try to load from localStorage first
        const storedData = loadFromLocalStorage();
        if (storedData) {
          initialData = normalizeAllProviders(storedData, parsedCategories);
        } else if (routingTableRes.success && routingTableRes.data) {
          // Parse from API
          const apiData = routingTableRes.data;
          let providersData: any[] = [];
          
          if (Array.isArray(apiData)) {
            providersData = apiData;
          } else if (apiData.data && Array.isArray(apiData.data)) {
            providersData = apiData.data;
          } else if (apiData.mapping && typeof apiData.mapping === 'object') {
            // Convert mapping object to array
            const mapping = apiData.mapping;
            providersData = Object.keys(mapping).map((providerKey, index) => {
              const categoryIds = Array.isArray(mapping[providerKey]) ? mapping[providerKey] : [];
              const categories = categoryIds.map((catId: string) => {
                const canonical = parsedCategories.find(c => c.id === catId);
                return {
                  id: catId,
                  region: 'Global' as const,
                  title: canonical?.title || canonical?.category || catId,
                };
              });
              
              return {
                id: `provider_${index}_${providerKey}`,
                payment_provider: providerKey,
                categories,
              };
            });
          }

          initialData = {
            data: providersData,
            error: null,
            status_code: 200,
            success: true,
          };

          initialData = normalizeAllProviders(initialData, parsedCategories);
        }

        if (initialData) {
          setData(initialData);
          
          // Validate
          const errors = validateMapping(initialData, parsedCategories);
          setValidationErrors(errors);

          // Auto-select first provider
          if (initialData.data.length > 0 && !selectedProviderId) {
            setSelectedProviderId(initialData.data[0].id);
          }
        } else {
          setError('No data available');
        }
      } catch (err) {
        console.error('[ProviderCategoriesCMS] Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered providers
  const filteredProviders = useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data.data;
    
    const query = searchTerm.toLowerCase();
    return data.data.filter(p =>
      p.payment_provider.toLowerCase().includes(query)
    );
  }, [data, searchTerm]);

  // Selected provider
  const selectedProvider = useMemo(() => {
    if (!data || !selectedProviderId) return null;
    return data.data.find(p => p.id === selectedProviderId) || null;
  }, [data, selectedProviderId]);

  // Categories not yet assigned to selected provider
  const availableCategories = useMemo(() => {
    if (!selectedProvider) return canonicalCategories;
    
    const assignedIds = new Set(selectedProvider.categories.map(c => c.id));
    return canonicalCategories.filter(c => !assignedIds.has(c.id));
  }, [canonicalCategories, selectedProvider]);

  // Show toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handlers
  const handleSave = () => {
    if (!data) return;
    
    try {
      saveToLocalStorage(data);
      showToast('Saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save', 'error');
    }
  };

  const handleDownload = () => {
    if (!data) return;
    
    try {
      downloadJSON(data, 'provider_categories.json');
      showToast('Downloaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to download', 'error');
    }
  };

  const handleReset = () => {
    if (!confirm('Reset to initial data? This will discard all changes.')) return;
    
    clearLocalStorage();
    window.location.reload();
  };

  const handleCopyProviderJSON = async () => {
    if (!selectedProvider) return;
    
    try {
      await copyToClipboard(selectedProvider);
      showToast('Copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
  };

  const handleAddCategory = (categoryId: string) => {
    if (!data || !selectedProviderId) return;
    
    const updated = addCategoryToProvider(data, selectedProviderId, categoryId, canonicalCategories);
    setData(updated);
    
    // Revalidate
    const errors = validateMapping(updated, canonicalCategories);
    setValidationErrors(errors);
  };

  const handleRemoveCategory = (categoryId: string) => {
    if (!data || !selectedProviderId) return;
    
    const updated = removeCategoryFromProvider(data, selectedProviderId, categoryId);
    setData(updated);
    
    // Revalidate
    const errors = validateMapping(updated, canonicalCategories);
    setValidationErrors(errors);
  };

  const handleClearAll = () => {
    if (!data || !selectedProviderId) return;
    if (!confirm('Remove all categories from this provider?')) return;
    
    const updated = clearProviderCategories(data, selectedProviderId);
    setData(updated);
    
    // Revalidate
    const errors = validateMapping(updated, canonicalCategories);
    setValidationErrors(errors);
  };

  const handleAddAll = () => {
    if (!data || !selectedProviderId) return;
    
    const updated = addAllCategoriesToProvider(data, selectedProviderId, canonicalCategories);
    setData(updated);
    
    // Revalidate
    const errors = validateMapping(updated, canonicalCategories);
    setValidationErrors(errors);
  };

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const categoryId = event.active.id as string;
    const category = canonicalCategories.find(c => c.id === categoryId);
    setDraggedCategory(category || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedCategory(null);

    if (!over || !selectedProviderId || !data) return;

    // If dropped on the provider area, add the category
    if (over.id === 'provider-drop-zone') {
      const categoryId = active.id as string;
      handleAddCategory(categoryId);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading CMS...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 font-semibold mb-2">Failed to load</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Package className="w-6 h-6 text-emerald-500" />
                Provider Categories CMS
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {data.data.length} providers · {canonicalCategories.length} categories
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {validationErrors.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {validationErrors.length} validation error{validationErrors.length > 1 ? 's' : ''}
                </div>
              )}
              
              <button
                onClick={handleReset}
                className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                  darkMode
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              
              <button
                onClick={handleSave}
                className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                  darkMode
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20'
                    : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                }`}
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              
              <button
                onClick={handleDownload}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  darkMode
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                <Download className="w-4 h-4" />
                Download JSON
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: Providers List */}
          <div className={`w-80 flex-shrink-0 border-r ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} flex flex-col`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {filteredProviders.length} of {data.data.length} providers
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredProviders.map((provider) => {
                const isSelected = selectedProviderId === provider.id;
                
                return (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProviderId(provider.id)}
                    className={`w-full px-4 py-3 flex items-center justify-between border-l-4 transition-all text-left ${
                      isSelected
                        ? darkMode
                          ? 'bg-emerald-900/30 border-emerald-500'
                          : 'bg-emerald-50 border-emerald-500'
                        : darkMode
                        ? 'bg-transparent border-transparent hover:bg-gray-800/50'
                        : 'bg-transparent border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate capitalize">
                        {provider.payment_provider.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {provider.categories.length} {provider.categories.length === 1 ? 'category' : 'categories'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MIDDLE: Preview Pane */}
          <div className={`flex-1 border-r ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} flex flex-col overflow-hidden`}>
            {selectedProvider ? (
              <>
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold capitalize">{selectedProvider.payment_provider.replace(/_/g, ' ')}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedProvider.categories.length} accepted {selectedProvider.categories.length === 1 ? 'category' : 'categories'}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearAll}
                        disabled={selectedProvider.categories.length === 0}
                        className={`px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 text-sm ${
                          selectedProvider.categories.length === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : darkMode
                            ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                            : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                      </button>
                      
                      <button
                        onClick={handleCopyProviderJSON}
                        className={`px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 text-sm ${
                          darkMode
                            ? 'bg-white/5 border-white/10 hover:bg-white/10'
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                        Copy JSON
                      </button>
                    </div>
                  </div>
                </div>

                <div 
                  id="provider-drop-zone"
                  className="flex-1 overflow-y-auto p-6"
                >
                  {selectedProvider.categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 mb-2">No categories assigned</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Drag categories from the right panel or click "Add All"
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedProvider.categories.map((category) => (
                        <div
                          key={category.id}
                          className={`p-3 rounded-lg border flex items-center justify-between ${
                            darkMode
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">{category.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{category.id}</div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveCategory(category.id)}
                            className="p-1 rounded hover:bg-red-500/10 text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a provider to manage categories
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Category Library */}
          <div className={`w-96 flex-shrink-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} flex flex-col`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold mb-2">Category Library</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {availableCategories.length} available · Drag to add
              </p>
              
              {selectedProvider && (
                <button
                  onClick={handleAddAll}
                  disabled={availableCategories.length === 0}
                  className={`mt-4 w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    availableCategories.length === 0
                      ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400'
                      : darkMode
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add All Categories
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <SortableContext items={availableCategories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {availableCategories.map((category) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      darkMode={darkMode}
                      onAdd={() => handleAddCategory(category.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            {toast.message}
          </div>
        )}

        {/* Drag Overlay */}
        <DragOverlay>
          {draggedCategory && (
            <div className={`p-3 rounded-lg border shadow-lg ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="font-medium text-sm">{draggedCategory.title || draggedCategory.category}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{draggedCategory.id}</div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

// Category Item Component (draggable)
function CategoryItem({ category, darkMode, onAdd }: {
  category: CanonicalCategory;
  darkMode: boolean;
  onAdd: () => void;
}) {
  return (
    <div
      id={category.id}
      draggable
      className={`p-3 rounded-lg border cursor-move transition-all hover:shadow-md ${
        darkMode
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-emerald-500/30'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-emerald-500/30'
      }`}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('categoryId', category.id);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-medium text-sm">{category.title || category.category}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{category.id}</div>
        </div>
        
        <button
          onClick={onAdd}
          className="p-1 rounded hover:bg-emerald-500/10 text-emerald-500 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default ProviderCategoriesCMS;
