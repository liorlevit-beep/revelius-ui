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
    // Generate gradient colors
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
    const index = provider.name.charCodeAt(0) % colors.length;
    const [fromColor, toColor] = colors[index];
    
    return (
      <div 
        className={`w-full h-full rounded-full bg-gradient-to-br ${fromColor} ${toColor} flex items-center justify-center text-white font-bold text-lg ${className}`}
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
