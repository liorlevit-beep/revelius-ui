import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';

export function MerchantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`Merchant ${id}`} timeRange="7" onTimeRangeChange={() => {}} />
      
      <main className="p-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Merchant Details
          </h2>
          <p className="text-gray-600">
            This is a placeholder page for merchant {id}. Detailed merchant information will be displayed here.
          </p>
        </div>
      </main>
    </div>
  );
}
