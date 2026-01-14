import { useState } from 'react';

interface EllipsisCellProps {
  value: string;
  className?: string;
  maxWidth?: string;
}

/**
 * Premium cell component that truncates with ellipsis and shows tooltip on hover
 */
export function EllipsisCell({ value, className = '', maxWidth }: EllipsisCellProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!value || value === '-') {
    return <span className={`text-gray-400 ${className}`}>-</span>;
  }

  return (
    <div className="relative inline-block" style={{ maxWidth }}>
      <div
        className={`whitespace-nowrap overflow-hidden text-ellipsis ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
      >
        {value}
      </div>
      {showTooltip && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal break-words max-w-md bottom-full left-0 mb-2 animate-fade-in">
          {value}
          <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}

interface SessionIdCellProps {
  sessionId: string;
  onCopy?: () => void;
}

/**
 * Specialized cell for session IDs with truncation and copy button
 */
export function SessionIdCell({ sessionId, onCopy }: SessionIdCellProps) {
  const truncated = sessionId.length > 16
    ? `${sessionId.substring(0, 8)}...${sessionId.substring(sessionId.length - 4)}`
    : sessionId;

  return (
    <div className="flex items-center gap-2 min-w-0">
      <EllipsisCell 
        value={truncated} 
        className="font-mono text-sm font-medium text-gray-900"
      />
    </div>
  );
}

interface UrlCellProps {
  url: string;
}

/**
 * Specialized cell for URLs with intelligent truncation
 */
export function UrlCell({ url }: UrlCellProps) {
  if (!url || url === '-') {
    return <span className="text-gray-400">-</span>;
  }

  let displayUrl = url;
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    displayUrl = urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
  } catch {
    // Keep original if can't parse
  }

  return <EllipsisCell value={displayUrl} className="text-sm text-gray-700" />;
}
