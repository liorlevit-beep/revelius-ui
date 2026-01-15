import { useState } from 'react';
import { X, Key, Copy, Check, AlertCircle } from 'lucide-react';
import { CopyButton } from './CopyButton';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  environment: 'sandbox' | 'production';
  onKeyCreated: (key: { name: string; permissions: string[]; secret: string }) => void;
}

const availablePermissions = [
  { value: 'read:merchants', label: 'Read Merchants' },
  { value: 'write:merchants', label: 'Write Merchants' },
  { value: 'read:scans', label: 'Read Scans' },
  { value: 'write:scans', label: 'Write Scans' },
  { value: 'read:reports', label: 'Read Reports' },
  { value: 'read:routing', label: 'Read Routing' },
  { value: 'write:routing', label: 'Write Routing' },
  { value: 'read:policies', label: 'Read Policies' },
  { value: 'write:policies', label: 'Write Policies' },
  { value: 'read:providers', label: 'Read Providers' },
  { value: 'write:providers', label: 'Write Providers' },
];

export function CreateApiKeyModal({ isOpen, onClose, environment, onKeyCreated }: CreateApiKeyModalProps) {
  const [step, setStep] = useState<'configure' | 'created'>('configure');
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [generatedSecret, setGeneratedSecret] = useState('');
  const [savedConfirmed, setSavedConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleTogglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleGenerate = () => {
    const prefix = environment === 'sandbox' ? 'rk_test_' : 'rk_live_';
    const randomStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const secret = prefix + randomStr;
    
    setGeneratedSecret(secret);
    onKeyCreated({ name, permissions: selectedPermissions, secret });
    setStep('created');
  };

  const handleClose = () => {
    if (step === 'created' && !savedConfirmed) {
      if (!confirm('Have you saved your API key? You won\'t be able to see it again.')) {
        return;
      }
    }
    
    // Reset
    setStep('configure');
    setName('');
    setSelectedPermissions([]);
    setGeneratedSecret('');
    setSavedConfirmed(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-8"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-100 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create API Key</h2>
            <p className="text-sm text-gray-600 mt-1">
              {step === 'configure' 
                ? `Generate a new ${environment} API key`
                : 'Save your API key now - you won\'t be able to see it again'}
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
          {step === 'configure' ? (
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Key Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My API Key"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A descriptive name to help you identify this key
                </p>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Permissions <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-200 rounded-xl p-4 space-y-2 max-h-64 overflow-y-auto">
                  {availablePermissions.map((perm) => (
                    <label
                      key={perm.value}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.value)}
                        onChange={() => handleTogglePermission(perm.value)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-900">{perm.label}</span>
                      <code className="text-xs text-gray-500 ml-auto">{perm.value}</code>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select the permissions this API key should have
                </p>
              </div>

              {/* Environment Badge */}
              <div className="flex items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <Key className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Environment: {environment}</p>
                  <p className="text-xs text-gray-600">
                    This key will only work in {environment} mode
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Warning */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Save this key now!</p>
                  <p className="text-sm text-amber-800">
                    For security reasons, you won't be able to view this key again. Make sure to copy and store it securely.
                  </p>
                </div>
              </div>

              {/* Generated Key */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your API Key</label>
                <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3">
                  <code className="flex-1 text-sm font-mono text-emerald-400 break-all">
                    {generatedSecret}
                  </code>
                  <CopyButton text={generatedSecret} className="bg-gray-800 hover:bg-gray-700 text-gray-300" />
                </div>
              </div>

              {/* Key Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
                  <p className="text-sm text-gray-900">{name}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Permissions</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedPermissions.map((perm) => (
                      <span
                        key={perm}
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-medium"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Environment</label>
                  <p className="text-sm text-gray-900 capitalize">{environment}</p>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={savedConfirmed}
                  onChange={(e) => setSavedConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">I have saved this key in a secure location</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Check this box to confirm you've copied and stored the API key
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-100 px-8 py-4 flex items-center justify-end gap-3 bg-gray-50">
          {step === 'configure' ? (
            <>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!name || selectedPermissions.length === 0}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate API Key
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              disabled={!savedConfirmed}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


