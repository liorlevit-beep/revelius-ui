import { X, ExternalLink } from 'lucide-react';
import type { Evidence } from './types';

interface EvidenceModalProps {
  evidence: Evidence | null;
  onClose: () => void;
}

export function EvidenceModal({ evidence, onClose }: EvidenceModalProps) {
  if (!evidence) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'screenshot':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'text':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'html':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'video':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-8"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-100 px-8 py-6 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border capitalize ${getTypeColor(evidence.type)}`}>
                {evidence.type}
              </span>
              <span className="text-sm text-gray-500">{evidence.timestamp.toLocaleString()}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{evidence.snippet}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
          {/* Screenshot/Visual Preview */}
          {evidence.type === 'screenshot' && (
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-sm text-gray-600">Screenshot Preview Placeholder</p>
                  <p className="text-xs text-gray-500 mt-2">
                    In production, this would display the actual screenshot
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Text/HTML Content */}
          {(evidence.type === 'text' || evidence.type === 'html') && (
            <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
              <div className="space-y-4">
                {evidence.highlightedText && (
                  <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <p className="text-xs font-semibold text-yellow-800 uppercase mb-2">Highlighted Content</p>
                    <p className="text-sm text-gray-900 font-mono">{evidence.highlightedText}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Context</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {evidence.snippet}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Video Preview */}
          {evidence.type === 'video' && (
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="text-center p-8 text-white">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-sm opacity-75">Video Preview Placeholder</p>
                  <p className="text-xs opacity-50 mt-2">
                    In production, this would display the video player
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Source URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Source URL</label>
            <a
              href={evidence.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <span className="flex-1 truncate">{evidence.url}</span>
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
            </a>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Type</label>
              <p className="text-sm text-gray-900 capitalize">{evidence.type}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Captured</label>
              <p className="text-sm text-gray-900">{evidence.timestamp.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-100 px-8 py-4 flex items-center justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-colors"
          >
            Close
          </button>
          <a
            href={evidence.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            Open Source
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}


