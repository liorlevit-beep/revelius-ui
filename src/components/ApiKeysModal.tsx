import { useState, useEffect } from 'react';
import { X, Key } from 'lucide-react';

const STORAGE_KEY = 'revelius_api_keys_configured';

interface ApiKeysModalProps {
  isOpen?: boolean; // Optional external control
  onClose?: () => void;
  onKeysConfigured?: () => void;
}

export function ApiKeysModal({ isOpen: externalIsOpen, onClose, onKeysConfigured }: ApiKeysModalProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  // Use external isOpen if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  useEffect(() => {
    // Only check localStorage if not externally controlled
    if (externalIsOpen === undefined) {
      const configured = localStorage.getItem(STORAGE_KEY);
      if (!configured) {
        setInternalIsOpen(true);
      }
    }
  }, [externalIsOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store in localStorage (in a real app, these would be securely handled)
    localStorage.setItem('revelius_access_key', accessKey);
    localStorage.setItem('revelius_secret_key', secretKey);
    localStorage.setItem(STORAGE_KEY, 'true');
    
    if (externalIsOpen === undefined) {
      setInternalIsOpen(false);
    }
    onKeysConfigured?.();
  };

  const handleClose = () => {
    // For demo purposes, allow closing without submitting
    localStorage.setItem(STORAGE_KEY, 'true');
    if (externalIsOpen === undefined) {
      setInternalIsOpen(false);
    }
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Key className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Revelius</h2>
            </div>
          </div>
          <p className="text-gray-600 mt-2">
            To get started, please configure your API credentials.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Access Key */}
          <div>
            <label htmlFor="accessKey" className="block text-sm font-semibold text-gray-700 mb-2">
              Access Key
            </label>
            <input
              id="accessKey"
              type="text"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Enter your access key"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Your unique access key identifier
            </p>
          </div>

          {/* Secret Key */}
          <div>
            <label htmlFor="secretKey" className="block text-sm font-semibold text-gray-700 mb-2">
              Secret Key
            </label>
            <input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter your secret key"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono"
              required
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Keep this secure and never share it
            </p>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-800">
              <strong>Demo Mode:</strong> You can enter any values for demonstration purposes. 
              In production, these credentials would be validated against our API.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm"
          >
            Configure & Continue
          </button>
        </form>
      </div>
    </div>
  );
}


