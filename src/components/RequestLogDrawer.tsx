import { X } from 'lucide-react';
import { JsonViewer } from './JsonViewer';
import type { RequestLog } from '../demo/developers';

interface RequestLogDrawerProps {
  log: RequestLog | null;
  onClose: () => void;
}

export function RequestLogDrawer({ log, onClose }: RequestLogDrawerProps) {
  if (!log) return null;

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status >= 400 && status < 500) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (status >= 500) return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
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
            <h3 className="text-lg font-bold text-gray-900">Request Log</h3>
            <p className="text-sm text-gray-600 mt-0.5">{log.requestId}</p>
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
          {/* Request Line */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Request</label>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold">
                {log.method}
              </span>
              <code className="text-sm font-mono text-gray-900">{log.endpoint}</code>
            </div>
          </div>

          {/* Status & Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(log.status)}`}>
                {log.status}
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Latency</label>
              <p className="text-sm font-semibold text-gray-900">{log.latency}ms</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Timestamp</label>
              <p className="text-sm text-gray-900">{log.timestamp.toLocaleString()}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Environment</label>
              <p className="text-sm text-gray-900 capitalize">{log.environment}</p>
            </div>
          </div>

          {/* Request Headers */}
          {log.headers && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Request Headers</label>
              <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                <JsonViewer data={log.headers} />
              </div>
            </div>
          )}

          {/* Request Body */}
          {log.body && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Request Body</label>
              <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                <JsonViewer data={log.body} />
              </div>
            </div>
          )}

          {/* Response */}
          {log.response && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Response</label>
              <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                <JsonViewer data={log.response} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


