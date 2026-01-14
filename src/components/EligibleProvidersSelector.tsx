import { useState } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';
import type { ProviderCoverage } from '../utils/routingEligibility';
import { getProviderDisplayName } from '../data/providerRegions';

interface EligibleProvidersSelectorProps {
  eligibleProviders: ProviderCoverage[];
  selectedProvider?: string;
  totalItems: number;
  onProviderSelect?: (provider: string) => void;
  readOnly?: boolean;
}

export function EligibleProvidersSelector({
  eligibleProviders,
  selectedProvider,
  totalItems,
  onProviderSelect,
  readOnly = true,
}: EligibleProvidersSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  if (eligibleProviders.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No eligible providers found
      </div>
    );
  }

  // Show first 6 providers as chips, rest in "+N more"
  const MAX_VISIBLE_CHIPS = 6;
  const visibleProviders = eligibleProviders.slice(0, MAX_VISIBLE_CHIPS);
  const hiddenCount = Math.max(0, eligibleProviders.length - MAX_VISIBLE_CHIPS);

  return (
    <div className="space-y-3">
      {/* Eligible Providers Chips */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Eligible Providers
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {visibleProviders.map((coverage) => {
            const isSelected = coverage.provider === selectedProvider;
            const displayName = getProviderDisplayName(coverage.provider);
            
            return (
              <button
                key={coverage.provider}
                onClick={() => !readOnly && onProviderSelect?.(coverage.provider)}
                disabled={readOnly}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : coverage.isDefault
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                } ${
                  !readOnly ? 'hover:shadow-md cursor-pointer' : 'cursor-default'
                }`}
                title={`Covers ${coverage.coverageCount}/${totalItems} items (${coverage.coveragePercentage}%)`}
              >
                {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                <span>{displayName}</span>
                {coverage.isDefault && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-white/50 border border-current">
                    Default
                  </span>
                )}
                <span className="text-[10px] opacity-70">
                  {coverage.coverageCount}/{totalItems}
                </span>
              </button>
            );
          })}
          
          {hiddenCount > 0 && (
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <span>+{hiddenCount} more</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown for all providers */}
      {!readOnly && (
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Select Provider
          </label>
          <div className="relative">
            <select
              value={selectedProvider || ''}
              onChange={(e) => onProviderSelect?.(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none cursor-pointer pr-10"
            >
              <option value="">Select a provider...</option>
              {eligibleProviders.map((coverage) => (
                <option key={coverage.provider} value={coverage.provider}>
                  {getProviderDisplayName(coverage.provider)}
                  {coverage.isDefault ? ' (Default)' : ''}
                  {' — '}
                  Covers {coverage.coverageCount}/{totalItems} items ({coverage.coveragePercentage}%)
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Expanded provider list (when "+N more" clicked) */}
      {showDropdown && hiddenCount > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              All Eligible Providers
            </h4>
            <button
              onClick={() => setShowDropdown(false)}
              className="text-xs text-gray-600 hover:text-gray-900"
            >
              Hide
            </button>
          </div>
          <div className="space-y-2">
            {eligibleProviders.map((coverage) => {
              const isSelected = coverage.provider === selectedProvider;
              const displayName = getProviderDisplayName(coverage.provider);
              
              return (
                <div
                  key={coverage.provider}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isSelected && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {displayName}
                        </span>
                        {coverage.isDefault && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        Covers {coverage.coverageCount}/{totalItems} items
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${
                      coverage.isFullCoverage ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {coverage.coveragePercentage}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {coverage.isFullCoverage ? 'Full' : 'Partial'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Coverage Summary */}
      {selectedProvider && (
        <div className="text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full" />
            <span>
              Selected: <strong>{getProviderDisplayName(selectedProvider)}</strong>
              {' — '}
              {eligibleProviders.find(p => p.provider === selectedProvider)?.isFullCoverage
                ? 'Full coverage'
                : `Covers ${eligibleProviders.find(p => p.provider === selectedProvider)?.coverageCount || 0}/${totalItems} items`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
