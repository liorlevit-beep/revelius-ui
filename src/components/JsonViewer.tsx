import { useState } from 'react';
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';

interface JsonViewerProps {
  data: any;
  name?: string;
  level?: number;
  expanded?: boolean;
}

export function JsonViewer({ data, name, level = 0, expanded = false }: JsonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(expanded || level < 2);

  const indent = level * 20;

  if (data === null) {
    return (
      <div style={{ paddingLeft: `${indent}px` }} className="text-sm font-mono">
        {name && <span className="text-purple-600">{name}: </span>}
        <span className="text-gray-400">null</span>
      </div>
    );
  }

  if (typeof data !== 'object') {
    return (
      <div style={{ paddingLeft: `${indent}px` }} className="text-sm font-mono">
        {name && <span className="text-purple-600">{name}: </span>}
        <span className={typeof data === 'string' ? 'text-green-600' : 'text-blue-600'}>
          {typeof data === 'string' ? `"${data}"` : String(data)}
        </span>
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const entries = isArray ? data.map((v, i) => [i, v]) : Object.entries(data);
  const isEmpty = entries.length === 0;

  return (
    <div style={{ paddingLeft: `${indent}px` }} className="text-sm font-mono">
      <div className="flex items-start gap-1">
        {!isEmpty && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 mt-0.5"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        {name && <span className="text-purple-600">{name}: </span>}
        <span className="text-gray-500">{isArray ? '[' : '{'}</span>
        {isEmpty && <span className="text-gray-500">{isArray ? ']' : '}'}</span>}
        {!isEmpty && !isExpanded && (
          <span className="text-gray-400 italic ml-1">
            {entries.length} {isArray ? 'items' : 'properties'}
          </span>
        )}
      </div>

      {!isEmpty && isExpanded && (
        <div>
          {entries.map(([key, value]) => (
            <JsonViewer
              key={key}
              data={value}
              name={isArray ? undefined : String(key)}
              level={level + 1}
              expanded={expanded}
            />
          ))}
          <div style={{ paddingLeft: `${indent}px` }} className="text-gray-500">
            {isArray ? ']' : '}'}
          </div>
        </div>
      )}
    </div>
  );
}

interface JsonViewerWrapperProps {
  data: any;
  title?: string;
}

export function JsonViewerWrapper({ data, title = 'JSON Data' }: JsonViewerWrapperProps) {
  const [expandAll, setExpandAll] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandAll(!expandAll)}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {expandAll ? 'Collapse All' : 'Expand All'}
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy JSON
              </>
            )}
          </button>
        </div>
      </div>
      <div className="bg-white p-4 overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin">
        <JsonViewer data={data} expanded={expandAll} />
      </div>
    </div>
  );
}


