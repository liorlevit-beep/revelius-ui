import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, Wallet } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { ProductsAPI } from '../api';

export function Providers() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch routing table on mount
  useEffect(() => {
    async function fetchRoutingTable() {
      try {
        setLoading(true);
        setError(null);
        const response = await ProductsAPI.getRoutingTable();
        console.log('[Providers] Raw API response:', response);
        
        // TODO: Parse response and extract PSPs
        setProviders([]);
      } catch (err: any) {
        console.error('[Providers] Failed to fetch routing table:', err);
        setError(err.message || 'Failed to load payment providers');
      } finally {
        setLoading(false);
      }
    }

    fetchRoutingTable();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Payment Providers" />

      <main className="p-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading payment providers...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-8">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Providers</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
              >
                Retry
              </button>
            </div>
          </Card>
        )}

        {/* Success State */}
        {!loading && !error && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Payment Service Providers</h2>
              <p className="text-sm text-gray-600 mt-1">
                {providers.length} {providers.length === 1 ? 'provider' : 'providers'} configured
              </p>
            </div>

            {providers.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
                  <p className="text-gray-600">Check the console for the API response structure.</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {providers.map((provider, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{provider.name}</h3>
                      <button
                        onClick={() => navigate(`/providers/${provider.id}`)}
                        className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
