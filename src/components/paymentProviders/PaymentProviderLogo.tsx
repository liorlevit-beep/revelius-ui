import { useState, useEffect } from 'react';
import { resolveProviderLogoUrl, getLocalFallbackPath, markDomainAsFailed, type PaymentProvider } from '../../utils/paymentProviderLogoResolver';

interface PaymentProviderLogoProps {
  provider: PaymentProvider;
  size?: number;
  className?: string;
}

export function PaymentProviderLogo({ provider, size = 56, className = '' }: PaymentProviderLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>(() => resolveProviderLogoUrl(provider));
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setLogoUrl(resolveProviderLogoUrl(provider));
    setHasFailed(false);
  }, [provider.key]);

  const handleError = () => {
    if (!hasFailed) {
      markDomainAsFailed(provider.key);
      setLogoUrl(getLocalFallbackPath(provider.key));
      setHasFailed(true);
    }
  };

  return (
    <img
      src={logoUrl}
      alt={`${provider.name} logo`}
      className={className}
      style={{ width: size, height: size }}
      onError={handleError}
      loading="lazy"
    />
  );
}
