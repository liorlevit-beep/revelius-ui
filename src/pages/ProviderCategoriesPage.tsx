import { useState, useMemo } from 'react';
import { Search, Package, Tag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import providerCategoriesData from '../data/revelius_provider_categories_full.json';

interface Category {
  id: string;
  region: string;
  title: string;
}

interface ProviderData {
  categories: Category[];
  id: string;
  payment_provider: string;
}

const ProviderCategoriesPage = () => {
  const { darkMode } = useTheme();
  const [selectedProvider, setSelectedProvider] = useState<ProviderData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const providers = providerCategoriesData.data;

  // Filter providers based on search
  const filteredProviders = useMemo(() => {
    if (!searchTerm) return providers;
    const query = searchTerm.toLowerCase();
    return providers.filter(p =>
      p.payment_provider.toLowerCase().includes(query) ||
      p.categories.some(c => c.title.toLowerCase().includes(query))
    );
  }, [searchTerm]);

  // Auto-select first provider
  const displayProvider = selectedProvider || filteredProviders[0] || null;

  // Get provider logo URL
  const getProviderLogo = (providerKey: string) => {
    const logoMap: Record<string, string> = {
      stripe: 'stripe.com',
      adyen: 'adyen.com',
      checkoutcom: 'checkout.com',
      worldpay: 'worldpay.com',
      fis: 'fisglobal.com',
      fiserv: 'fiserv.com',
      globalpayments: 'globalpayments.com',
      nuvei: 'nuvei.com',
      rapyd: 'rapyd.net',
      paypal: 'paypal.com',
      square: 'squareup.com',
      braintree: 'braintreepayments.com',
      authorizenet: 'authorize.net',
      chasepaymentech: 'chase.com',
      elavon: 'elavon.com',
      bluesnap: 'bluesnap.com',
      mollie: 'mollie.com',
      worldline: 'worldline.com',
      nexi: 'nexigroup.com',
      klarna: 'klarna.com',
      trustly: 'trustly.com',
      vivawallet: 'vivawallet.com',
      payu: 'payu.com',
      truelayer: 'truelayer.com',
      gocardless: 'gocardless.com',
      tranzila: 'tranzila.com',
      payplus: 'payplus.co.il',
      zcredit: 'zcredit.co.il',
      hyp: 'hyp.co.il',
      isracard: 'isracard.co.il',
      mercadopago: 'mercadopago.com',
      ebanx: 'ebanx.com',
      dlocal: 'dlocal.com',
      pagseguro: 'pagseguro.com.br',
      cielo: 'cielo.com.br',
      paytm: 'paytm.com',
      razorpay: 'razorpay.com',
      xendit: 'xendit.co',
      '2c2p': '2c2p.com',
      airwallex: 'airwallex.com',
      alipay: 'alipay.com',
      wechatpay: 'wechat.com',
      paystack: 'paystack.com',
      flutterwave: 'flutterwave.com',
      mpesa: 'safaricom.com',
      networkinternational: 'network.ae',
      paymob: 'paymob.com',
      hyperpay: 'hyperpay.com',
      stripe_us: 'stripe.com',
      stripe_uk: 'stripe.com',
      adyen_eu: 'adyen.com',
      checkoutcom_uk: 'checkout.com',
      worldpay_uk: 'worldpay.com',
      payu_latam: 'payu.com',
      payu_uk: 'payu.com',
      paypal_us: 'paypal.com',
    };

    const domain = logoMap[providerKey.toLowerCase()];
    return domain ? `https://logo.clearbit.com/${domain}` : null;
  };

  // Get provider initials
  const getProviderInitials = (name: string) => {
    const words = name.split(/[_\s]/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get risk level based on category
  const getRiskLevel = (title: string): 'low' | 'medium' | 'high' => {
    const lower = title.toLowerCase();
    if (lower.includes('gambling') || lower.includes('casino') || 
        lower.includes('adult') || lower.includes('dating') || 
        lower.includes('escort') || lower.includes('cbd') || 
        lower.includes('marijuana')) return 'high';
    if (lower.includes('alcohol') || lower.includes('tobacco') || 
        lower.includes('cigar') || lower.includes('pawn') || 
        lower.includes('telemarketing') || lower.includes('security broker')) return 'medium';
    return 'low';
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'from-red-500/20 to-orange-500/20 border-red-500/30';
      case 'medium': return 'from-amber-500/20 to-yellow-500/20 border-amber-500/30';
      case 'low': return 'from-emerald-500/20 to-green-500/20 border-emerald-500/30';
    }
  };

  const getRiskBadgeColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Left Sidebar - Provider List */}
      <div className={`w-80 flex-shrink-0 border-r ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} flex flex-col`}>
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-500" />
            Payment Providers
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-emerald-500 focus:border-emerald-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500'
              } focus:outline-none focus:ring-2`}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {filteredProviders.length} of {providers.length} providers
          </div>
        </div>

        {/* Provider List */}
        <div className="flex-1 overflow-y-auto">
          {filteredProviders.map((provider) => {
            const isSelected = displayProvider?.id === provider.id;
            const logoUrl = getProviderLogo(provider.payment_provider);
            const initials = getProviderInitials(provider.payment_provider);
            
            return (
              <motion.button
                key={provider.id}
                onClick={() => setSelectedProvider(provider)}
                className={`w-full px-4 py-3 flex items-center gap-3 border-l-4 transition-all ${
                  isSelected
                    ? darkMode
                      ? 'bg-emerald-900/30 border-emerald-500 shadow-lg'
                      : 'bg-emerald-50 border-emerald-500 shadow-md'
                    : darkMode
                    ? 'bg-transparent border-transparent hover:bg-gray-800/50'
                    : 'bg-transparent border-transparent hover:bg-gray-50'
                }`}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Logo Circle */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={provider.payment_provider}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-white text-sm font-bold">${initials}</span>`;
                        }
                      }}
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">{initials}</span>
                  )}
                </div>

                {/* Provider Info */}
                <div className="flex-1 text-left min-w-0">
                  <div className="font-semibold text-sm truncate capitalize">
                    {provider.payment_provider.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {provider.categories.length} categories
                  </div>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <Star className="w-4 h-4 text-emerald-500 fill-emerald-500 flex-shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Category Details */}
      <div className="flex-1 overflow-y-auto">
        {displayProvider ? (
          <div className="p-8">
            {/* Provider Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center overflow-hidden">
                  {(() => {
                    const logoUrl = getProviderLogo(displayProvider.payment_provider);
                    const initials = getProviderInitials(displayProvider.payment_provider);
                    return logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={displayProvider.payment_provider}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-white text-xl font-bold">${initials}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-white text-xl font-bold">{initials}</span>
                    );
                  })()}
                </div>
                <div>
                  <h2 className="text-3xl font-bold capitalize">
                    {displayProvider.payment_provider.replace(/_/g, ' ')}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    ID: {displayProvider.id}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm">
                    <span className="font-bold text-2xl text-emerald-500">{displayProvider.categories.length}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">Supported Categories</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Category Coverage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayProvider.categories.map((category) => {
                  const riskLevel = getRiskLevel(category.title);
                  const riskColor = getRiskColor(riskLevel);
                  const badgeColor = getRiskBadgeColor(riskLevel);

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border bg-gradient-to-br ${riskColor} ${
                        darkMode ? 'border-white/10' : 'border-gray-200'
                      } hover:bg-gray-800 dark:hover:bg-gray-950 hover:shadow-lg transition-all duration-200 group cursor-default`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm flex-1 group-hover:text-white transition-colors">
                          {category.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${badgeColor} flex-shrink-0`}>
                          {riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-300">
                        <span className="font-mono">{category.region}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No providers found' : 'Select a provider to view categories'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderCategoriesPage;
