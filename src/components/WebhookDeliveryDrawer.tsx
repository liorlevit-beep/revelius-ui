import { X, CheckCircle, XCircle, Clock } from 'lucide-react';
import { JsonViewer } from './JsonViewer';
import type { WebhookDelivery } from '../demo/developers';

interface WebhookDeliveryDrawerProps {
  delivery: WebhookDelivery | null;
  onClose: () => void;
}

export function WebhookDeliveryDrawer({ delivery, onClose }: WebhookDeliveryDrawerProps) {
  if (!delivery) return null;

  const getStatusIcon = () => {
    switch (delivery.status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusColor = () => {
    switch (delivery.status) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:w-[600px] h-[90vh] sm:h-full sm:max-h-[90vh] rounded-t-2xl sm:rounded-l-2xl sm:rounded-r-none shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Webhook Delivery</h3>
            <p className="text-sm text-gray-600 mt-0.5">{delivery.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Status</label>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${getStatusColor()}`}>
                {getStatusIcon()}
                {delivery.status}
              </span>
              <span className="text-sm text-gray-600">
                {delivery.statusCode} • {delivery.latency}ms
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Event</label>
              <p className="text-sm font-mono text-gray-900">{delivery.event}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Timestamp</label>
              <p className="text-sm text-gray-900">{delivery.timestamp.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Environment</label>
              <p className="text-sm text-gray-900 capitalize">{delivery.environment}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Latency</label>
              <p className="text-sm text-gray-900">{delivery.latency}ms</p>
            </div>
          </div>

          {/* Request Payload */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Request Payload</label>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <JsonViewer data={delivery.payload} />
            </div>
          </div>

          {/* Response */}
          {delivery.response && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Response</label>
              <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                <JsonViewer data={delivery.response} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


