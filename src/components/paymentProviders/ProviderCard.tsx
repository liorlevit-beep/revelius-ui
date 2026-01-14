import { useState } from 'react';
import { Globe, TrendingUp, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Provider } from '../../types/paymentProviders';
import { getProviderDomain } from '../../data/providerRegions';

interface ProviderCardProps {
  provider: Provider;
  totalCategories: number;
  onClick?: () => void;
}

export function ProviderCard({ provider, totalCategories, onClick }: ProviderCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Calculate coverage
  const coverage = totalCategories > 0 ? provider.categoryIds.length / totalCategories : 0;
  const coveragePercent = Math.round(coverage * 100);
  const hasAllCategories = coverage >= 0.98;

  // Get logo URL from Clearbit
  const domain = getProviderDomain(provider.key);
  const logoUrl = domain ? `https://logo.clearbit.com/${domain}` : null;

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

  const [fromColor, toColor] = getGradientColors(provider.name);
  const initials = getInitials(provider.name);

  // Show max 3 regions, rest as "+N"
  const visibleRegions = provider.regions.slice(0, 3);
  const remainingCount = provider.regions.length - 3;

  // Mock sparkline data
  const mockSparklinePoints = Array.from({ length: 12 }, (_, i) => {
    const base = 40 + Math.random() * 30;
    return base + Math.sin(i / 2) * 10;
  });
  const maxPoint = Math.max(...mockSparklinePoints);
  const sparklinePoints = mockSparklinePoints.map((y, x) => {
    const normalizedY = 30 - (y / maxPoint) * 30;
    return `${x * 8},${normalizedY}`;
  }).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: hasAllCategories ? -6 : -4 }}
      className="group"
    >
      <div
        className={`relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
          hasAllCategories
            ? isHovered
              ? 'border-amber-300 shadow-xl shadow-amber-100/50 ring-2 ring-amber-200'
              : 'border-amber-200 shadow-md ring-1 ring-amber-100'
            : isHovered
            ? 'border-emerald-300 shadow-xl shadow-emerald-100/50'
            : 'border-gray-100 shadow-sm'
        }`}
      >
        {/* Gradient accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${fromColor} ${toColor}`} />

        <div className="p-6">
          {/* Top Row: Logo + Name + Default Badge */}
          <div className="flex items-start gap-4 mb-4">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-white"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              {logoUrl && !logoError ? (
                <img
                  src={logoUrl}
                  alt={`${provider.name} logo`}
                  className="w-full h-full object-contain p-2"
                  onError={() => setLogoError(true)}
                  loading="lazy"
                />
              ) : (
                <div className={`w-full h-full rounded-full bg-gradient-to-br ${fromColor} ${toColor} flex items-center justify-center text-white font-bold text-lg`}>
                  {initials}
                </div>
              )}
            </motion.div>

            {/* Name + Key */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 truncate">{provider.name}</h3>
                {provider.isDefault && (
                  <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                    DEFAULT
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-mono truncate">{provider.key}</p>
            </div>
          </div>

          {/* Middle: Region Chips */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Regions</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {visibleRegions.map((region) => (
                <span
                  key={region}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {region}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  +{remainingCount}
                </span>
              )}
            </div>
          </div>

          {/* Coverage Bar */}
          {totalCategories > 0 && (
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Coverage</span>
                {hasAllCategories && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300"
                  >
                    <Sparkles className="w-3 h-3" />
                    All Categories
                  </motion.span>
                )}
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${coveragePercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`absolute top-0 left-0 h-full rounded-full ${
                    hasAllCategories
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                      : coveragePercent >= 75
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                      : coveragePercent >= 50
                      ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}
                />
              </div>
              <div className="mt-1 text-right">
                <span className={`text-xs font-semibold ${
                  hasAllCategories ? 'text-amber-700' : 'text-gray-600'
                }`}>
                  {coveragePercent}%
                </span>
              </div>
            </div>
          )}

          {/* Bottom: Category Count + Sparkline + CTA */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            {/* Category Count + Sparkline */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{provider.categoryIds.length}</span>{' '}
                  {provider.categoryIds.length === 1 ? 'category' : 'categories'}
                </span>
              </div>
              
              {/* Mini Sparkline */}
              <svg width="80" height="30" className="text-emerald-500">
                <polyline
                  points={sparklinePoints}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={onClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                isHovered
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>Open Provider</span>
              <ExternalLink className={`w-4 h-4 transition-all duration-200 ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
