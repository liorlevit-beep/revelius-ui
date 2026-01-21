import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GenerateFromScanModal } from '../components/products/GenerateFromScanModal';

export function GenerateFromScan() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-medium mb-4">
            No session ID provided
          </p>
          <button
            onClick={() => navigate('/transactions')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  const handleClose = () => {
    navigate('/transactions');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Transactions</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Generate Transaction from Scan
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Session: <span className="font-mono text-xs">{sessionId}</span>
          </p>
        </div>
      </div>

      {/* Content - Render modal as inline content */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-6">
        <GenerateFromScanModal
          isOpen={true}
          onClose={handleClose}
          sessionId={sessionId}
          asPage={true}
        />
      </div>
    </div>
  );
}
