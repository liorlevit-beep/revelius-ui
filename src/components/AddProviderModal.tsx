import { useState } from 'react';
import { X, Search, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { Card } from './Card';
import { Chip } from './Badges';
import { availableProvidersCatalog, type Provider } from '../demo/providers';
import { useProviders } from '../state/providersStore';

interface AddProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'select' | 'configure' | 'test' | 'success';

export function AddProviderModal({ isOpen, onClose }: AddProviderModalProps) {
  const { addProvider } = useProviders();
  const [step, setStep] = useState<Step>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<typeof availableProvidersCatalog[0] | null>(null);
  const [environment, setEnvironment] = useState('production');
  const [apiKey, setApiKey] = useState('');
  const [accountId, setAccountId] = useState('');
  const [testing, setTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [testError, setTestError] = useState('');

  if (!isOpen) return null;

  const filteredProviders = availableProvidersCatalog.filter((provider) =>
    searchQuery === '' ||
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProvider = (provider: typeof availableProvidersCatalog[0]) => {
    setSelectedProvider(provider);
    setStep('configure');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestError('');
    setTestSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock: 90% success rate
    if (Math.random() > 0.1) {
      setTestSuccess(true);
      setTesting(false);
      setTimeout(() => {
        setStep('success');
      }, 1000);
    } else {
      setTestError('Authentication failed. Please check your API key.');
      setTesting(false);
    }
  };

  const handleConnect = () => {
    if (!selectedProvider) return;

    // Create new provider
    const newProvider: Provider = {
      id: selectedProvider.id,
      name: selectedProvider.name,
      logoText: selectedProvider.logoText,
      status: 'connected',
      regions: selectedProvider.regions,
      methods: selectedProvider.methods,
      lastSync: new Date(),
      connectedAt: new Date(),
      stats: {
        volumeSharePct: 0,
        approvalRatePct: 0,
        declineRatePct: 0,
        avgCostBps: 0,
        chargebackRatePct: 0,
      },
      series30d: [],
      topMerchants: [],
      constraints: {
        countries: [],
        restrictedCategories: [],
        notes: [],
      },
      routingWeight: 50,
      declineReasons: [],
    };

    addProvider(newProvider);
    
    // Reset and close
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setStep('select');
    setSearchQuery('');
    setSelectedProvider(null);
    setEnvironment('production');
    setApiKey('');
    setAccountId('');
    setTesting(false);
    setTestSuccess(false);
    setTestError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-8"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-100 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'select' && 'Add Payment Provider'}
              {step === 'configure' && `Configure ${selectedProvider?.name}`}
              {step === 'test' && 'Testing Connection'}
              {step === 'success' && 'Provider Connected'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {step === 'select' && 'Select a provider from the catalog'}
              {step === 'configure' && 'Enter your connection credentials'}
              {step === 'test' && 'Verifying credentials...'}
              {step === 'success' && 'Successfully connected to provider'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
          {/* Step 1: Select Provider */}
          {step === 'select' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>

              {/* Provider Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProviders.map((provider) => (
                  <Card
                    key={provider.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleSelectProvider(provider)}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {provider.logoText.substring(0, 2)}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-gray-900">{provider.name}</h3>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{provider.description}</p>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-semibold text-gray-500 block mb-1">Regions</span>
                          <div className="flex flex-wrap gap-1">
                            {provider.regions.slice(0, 4).map((region) => (
                              <Chip key={region} label={region} />
                            ))}
                            {provider.regions.length > 4 && (
                              <span className="text-xs text-gray-500">+{provider.regions.length - 4}</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-xs font-semibold text-gray-500 block mb-1">Specialties</span>
                          <div className="flex flex-wrap gap-1">
                            {provider.specialties.map((specialty) => (
                              <Chip key={specialty} label={specialty} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Configure */}
          {step === 'configure' && selectedProvider && (
            <div className="space-y-6">
              <Card>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {selectedProvider.logoText.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedProvider.name}</h3>
                      <p className="text-sm text-gray-600">{selectedProvider.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Environment */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Environment
                      </label>
                      <select
                        value={environment}
                        onChange={(e) => setEnvironment(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      >
                        <option value="sandbox">Sandbox (Test)</option>
                        <option value="production">Production</option>
                      </select>
                    </div>

                    {/* API Key */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        API Key <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk_live_..."
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Account ID (optional) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account ID <span className="text-gray-400">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        placeholder="acct_..."
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Webhook URL (read-only) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Webhook URL
                      </label>
                      <input
                        type="text"
                        value="https://api.revelius.com/webhooks/providers"
                        readOnly
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Configure this URL in your provider dashboard to receive real-time events
                      </p>
                    </div>

                    {/* Test Results */}
                    {testSuccess && (
                      <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-emerald-800">
                          Connection test successful! Ready to connect.
                        </span>
                      </div>
                    )}

                    {testError && (
                      <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-red-800">{testError}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && selectedProvider && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Provider Connected!</h3>
              <p className="text-gray-600 text-center mb-8">
                {selectedProvider.name} has been successfully added to your payment providers.
              </p>
              <button
                onClick={handleConnect}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
              >
                Go to Providers
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step === 'configure' && (
          <div className="flex-shrink-0 border-t border-gray-100 px-8 py-4 flex items-center justify-between bg-gray-50">
            <button
              onClick={() => setStep('select')}
              className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-colors"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleTestConnection}
                disabled={!apiKey || testing}
                className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {testing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </button>
              {testSuccess && (
                <button
                  onClick={handleConnect}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Connect Provider
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


