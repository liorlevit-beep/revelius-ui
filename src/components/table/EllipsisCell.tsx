import { useState } from 'react';

interface EllipsisCellProps {
  value: string | number | null | undefined;
  title?: string;
  className?: string;
}

/**
 * Single-line cell with ellipsis and tooltip on hover/focus
 */
export function EllipsisCell({ value, title, className = '' }: EllipsisCellProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Handle empty values
  if (value === null || value === undefined || value === '') {
    return <span className={`text-gray-400 ${className}`}>—</span>;
  }

  const displayValue = String(value);
  const tooltipText = title || displayValue;

  return (
    <div className="relative inline-block max-w-full">
      <span
        className={`inline-block whitespace-nowrap overflow-hidden text-ellipsis max-w-full cursor-default ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={0}
        title={tooltipText}
      >
        {displayValue}
      </span>
      
      {showTooltip && displayValue.length > 20 && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal break-words max-w-xs bottom-full left-0 mb-2 pointer-events-none">
          {tooltipText}
          <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}

interface SessionIdCellProps {
  sessionId: string;
  className?: string;
}

/**
 * Session ID cell with smart truncation (first 6 + "…" + last 4)
 */
export function SessionIdCell({ sessionId, className = '' }: SessionIdCellProps) {
  const displayValue = sessionId.length > 16
    ? `${sessionId.substring(0, 6)}…${sessionId.substring(sessionId.length - 4)}`
    : sessionId;

  return (
    <EllipsisCell 
      value={displayValue} 
      title={sessionId}
      className={`font-mono ${className}`}
    />
  );
}

interface UrlCellProps {
  url: string;
  className?: string;
}

/**
 * URL cell with hostname + path display
 */
export function UrlCell({ url, className = '' }: UrlCellProps) {
  let displayUrl = url;
  
  try {
    if (url && url !== '-') {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      displayUrl = urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
    }
  } catch {
    // Keep original if can't parse
    displayUrl = url;
  }

  return <EllipsisCell value={displayUrl} title={url} className={className} />;
}
