import { useState, useEffect } from 'react';
import { resolveProviderLogo, markProviderLogoFailed, generateInitials } from '../../utils/providerLogoResolver';

export interface PaymentProvider {
  key: string;
  name: string;
}

interface PaymentProviderLogoProps {
  provider: PaymentProvider;
  size?: number;
  className?: string;
}

export function PaymentProviderLogo({ provider, size = 56, className = '' }: PaymentProviderLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoType, setLogoType] = useState<'logo-dev' | 'local' | 'initials'>('logo-dev');
  const [showInitials, setShowInitials] = useState(false);

  useEffect(() => {
    const loadLogo = async () => {
      const result = await resolveProviderLogo(provider.key, provider.name);
      
      if (result.src) {
        setLogoUrl(result.src);
        setLogoType(result.type);
        setShowInitials(false);
      } else {
        setShowInitials(true);
      }
    };
    
    loadLogo();
  }, [provider.key, provider.name]);

  const handleError = () => {
    // If logo.dev failed, mark it and try local
    if (logoType === 'logo-dev') {
      markProviderLogoFailed(provider.key);
      const basePath = import.meta.env.BASE_URL || '/';
      const localPath = `${basePath}provider-logos/${provider.key}.svg`.replace(/\/+/g, '/').replace(':/', '://');
      setLogoUrl(localPath);
      setLogoType('local');
    } else {
      // Local also failed, show initials
      setShowInitials(true);
    }
  };

  if (showInitials) {
    const initials = generateInitials(provider.name);
    // Generate text colors (matching the container's style)
    const textColors = [
      'text-emerald-600 dark:text-emerald-400',
      'text-blue-600 dark:text-blue-400',
      'text-purple-600 dark:text-purple-400',
      'text-pink-600 dark:text-pink-400',
      'text-orange-600 dark:text-orange-400',
      'text-cyan-600 dark:text-cyan-400',
      'text-indigo-600 dark:text-indigo-400',
      'text-teal-600 dark:text-teal-400',
    ];
    const index = provider.name.charCodeAt(0) % textColors.length;
    const textColor = textColors[index];
    
    return (
      <div 
        className={`w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center ${textColor} font-bold text-lg ${className}`}
        style={{ width: size, height: size }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={logoUrl || ''}
      alt={`${provider.name} logo`}
      className={className}
      style={{ width: size, height: size }}
      onError={handleError}
      loading="lazy"
    />
  );
}
