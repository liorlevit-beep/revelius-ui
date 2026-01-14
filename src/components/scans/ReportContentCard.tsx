import { useState } from 'react';
import { Shield, AlertCircle, Eye, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';

export interface ReportItem {
  content_type: string;
  url: string;
  url_referrer?: string;
  confidence: number;
  blocked: boolean;
  review_required: boolean;
  blocked_reason?: string;
  [key: string]: any;
}

interface ReportContentCardProps {
  item: ReportItem & { _bucket?: 'passed' | 'failed' };
  onClick: () => void;
}

export function ReportContentCard({ item, onClick }: ReportContentCardProps) {
  const [imageError, setImageError] = useState(false);
  const isImage = item.content_type === 'image';
  const isText = item.content_type === 'text';

  // Get shortened URL for display
  const getShortUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return `${parsed.hostname}${parsed.pathname !== '/' ? parsed.pathname : ''}`;
    } catch {
      return url;
    }
  };

  // Confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-emerald-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden hover:-translate-y-0.5"
    >
      {/* Image Thumbnail */}
      {isImage && (
        <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
          {!imageError ? (
            <img
              src={item.url}
              alt="Scanned content"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Preview unavailable</p>
              </div>
            </div>
          )}
          
          {/* Image badge overlay */}
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-purple-600/90 text-white backdrop-blur-sm">
              <ImageIcon className="w-3 h-3 mr-1" />
              Image
            </span>
          </div>
        </div>
      )}

      {/* Text content preview */}
      {isText && (
        <div className="w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-200">
          <div className="text-center px-4">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-xs font-medium text-gray-600">Text page</p>
            <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]" title={item.url}>
              {getShortUrl(item.url)}
            </p>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-4">
        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Passed/Failed Badge */}
          {item._bucket === 'failed' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
              <AlertCircle className="w-3 h-3 mr-1" />
              Failed
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
              <Shield className="w-3 h-3 mr-1" />
              Passed
            </span>
          )}

          {/* Blocked Badge */}
          {item.blocked && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
              Blocked
            </span>
          )}

          {/* Review Required Badge */}
          {item.review_required && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
              <Eye className="w-3 h-3 mr-1" />
              Review
            </span>
          )}
        </div>

        {/* Blocked Reason */}
        {item.blocked_reason && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Blocked Reason:</p>
            <p 
              className="text-sm text-gray-700 truncate" 
              title={item.blocked_reason}
            >
              {item.blocked_reason}
            </p>
          </div>
        )}

        {/* URL */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            URL
          </p>
          <p className="text-xs text-gray-700 truncate" title={item.url}>
            {getShortUrl(item.url)}
          </p>
        </div>

        {/* Confidence Meter */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-gray-500">Confidence</p>
            <p className="text-xs font-semibold text-gray-900">
              {Math.round(item.confidence * 100)}%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${getConfidenceColor(item.confidence)}`}
              style={{ width: `${item.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* View Details Hint */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Click to view details
          </p>
        </div>
      </div>
    </div>
  );
}
