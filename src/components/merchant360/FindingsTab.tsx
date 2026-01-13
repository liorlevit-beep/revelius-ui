import { useState, useMemo } from 'react';
import { Chip } from '../Badges';
import type { Finding, Evidence } from './types';
import { FindingDrawer } from './FindingDrawer';
import { EvidenceModal } from './EvidenceModal';

interface FindingsTabProps {
  findings: Finding[];
  onFindingClick?: (finding: Finding) => void;
  selectedFindingId?: string;
}

export function FindingsTab({ findings, onFindingClick, selectedFindingId }: FindingsTabProps) {
  const [selectedFindings, setSelectedFindings] = useState<Finding | null>(
    selectedFindingId ? findings.find(f => f.id === selectedFindingId) || null : null
  );
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [severityFilters, setSeverityFilters] = useState<Set<string>>(new Set());
  const [surfaceFilters, setSurfaceFilters] = useState<Set<string>>(new Set());
  const [policyTagFilters, setPolicyTagFilters] = useState<Set<string>>(new Set());
  const [showNewOnly, setShowNewOnly] = useState(false);

  const allPolicyTags = useMemo(() => {
    const tags = new Set<string>();
    findings.forEach(f => f.policyTags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [findings]);

  const filteredFindings = useMemo(() => {
    return findings.filter((finding) => {
      if (severityFilters.size > 0 && !severityFilters.has(finding.severity)) return false;
      if (surfaceFilters.size > 0 && !surfaceFilters.has(finding.surface)) return false;
      if (policyTagFilters.size > 0 && !finding.policyTags.some(tag => policyTagFilters.has(tag))) return false;
      if (showNewOnly && !finding.isNew) return false;
      return true;
    });
  }, [findings, severityFilters, surfaceFilters, policyTagFilters, showNewOnly]);

  const groupedFindings = useMemo(() => {
    const groups = {
      critical: [] as Finding[],
      high: [] as Finding[],
      medium: [] as Finding[],
      low: [] as Finding[],
    };

    filteredFindings.forEach(finding => {
      groups[finding.severity].push(finding);
    });

    return groups;
  }, [filteredFindings]);

  const handleToggleFilter = (set: Set<string>, value: string, setter: (set: Set<string>) => void) => {
    const newSet = new Set(set);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setter(newSet);
  };

  const handleFindingClick = (finding: Finding) => {
    setSelectedFindings(finding);
    onFindingClick?.(finding);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Left: Filters */}
      <div className="w-64 flex-shrink-0 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Filters</h3>
          
          {/* Severity */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Severity</label>
            <div className="space-y-2">
              {['critical', 'high', 'medium', 'low'].map((severity) => (
                <label
                  key={severity}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={severityFilters.has(severity)}
                    onChange={() => handleToggleFilter(severityFilters, severity, setSeverityFilters)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold border capitalize ${getSeverityColor(severity)}`}>
                    {severity}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Surface */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Surface</label>
            <div className="space-y-2">
              {['website', 'app', 'ugc', 'checkout'].map((surface) => (
                <label
                  key={surface}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={surfaceFilters.has(surface)}
                    onChange={() => handleToggleFilter(surfaceFilters, surface, setSurfaceFilters)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-900 capitalize">{surface}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Policy Tags */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Policy Tags</label>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
              {allPolicyTags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={policyTagFilters.has(tag)}
                    onChange={() => handleToggleFilter(policyTagFilters, tag, setPolicyTagFilters)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-900">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* New Since Last Scan */}
          <div>
            <label className="flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={showNewOnly}
                onChange={(e) => setShowNewOnly(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-blue-900">New since last scan</span>
            </label>
          </div>

          {/* Clear Filters */}
          {(severityFilters.size > 0 || surfaceFilters.size > 0 || policyTagFilters.size > 0 || showNewOnly) && (
            <button
              onClick={() => {
                setSeverityFilters(new Set());
                setSurfaceFilters(new Set());
                setPolicyTagFilters(new Set());
                setShowNewOnly(false);
              }}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Right: Findings List */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Findings ({filteredFindings.length})
          </h3>
        </div>

        {filteredFindings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No findings match your filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Critical Findings */}
            {groupedFindings.critical.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-700 uppercase mb-3">Critical ({groupedFindings.critical.length})</h4>
                <div className="space-y-3">
                  {groupedFindings.critical.map((finding) => (
                    <FindingCard
                      key={finding.id}
                      finding={finding}
                      onClick={() => handleFindingClick(finding)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* High Findings */}
            {groupedFindings.high.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-orange-700 uppercase mb-3">High ({groupedFindings.high.length})</h4>
                <div className="space-y-3">
                  {groupedFindings.high.map((finding) => (
                    <FindingCard
                      key={finding.id}
                      finding={finding}
                      onClick={() => handleFindingClick(finding)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Medium Findings */}
            {groupedFindings.medium.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-amber-700 uppercase mb-3">Medium ({groupedFindings.medium.length})</h4>
                <div className="space-y-3">
                  {groupedFindings.medium.map((finding) => (
                    <FindingCard
                      key={finding.id}
                      finding={finding}
                      onClick={() => handleFindingClick(finding)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Low Findings */}
            {groupedFindings.low.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-blue-700 uppercase mb-3">Low ({groupedFindings.low.length})</h4>
                <div className="space-y-3">
                  {groupedFindings.low.map((finding) => (
                    <FindingCard
                      key={finding.id}
                      finding={finding}
                      onClick={() => handleFindingClick(finding)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Finding Drawer */}
      <FindingDrawer
        finding={selectedFindings}
        onClose={() => setSelectedFindings(null)}
        onEvidenceClick={(evidence) => setSelectedEvidence(evidence)}
      />

      {/* Evidence Modal */}
      <EvidenceModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
}

// Finding Card Component
interface FindingCardProps {
  finding: Finding;
  onClick: () => void;
}

function FindingCard({ finding, onClick }: FindingCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 hover:border-red-300';
      case 'high':
        return 'bg-orange-50 border-orange-200 hover:border-orange-300';
      case 'medium':
        return 'bg-amber-50 border-amber-200 hover:border-amber-300';
      case 'low':
        return 'bg-blue-50 border-blue-200 hover:border-blue-300';
      default:
        return 'bg-gray-50 border-gray-200 hover:border-gray-300';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-2 rounded-xl transition-all ${getSeverityColor(finding.severity)}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${getSeverityBadgeColor(finding.severity)}`}>
              {finding.severity}
            </span>
            {finding.isNew && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                New
              </span>
            )}
            <span className="text-xs text-gray-600">{finding.confidence}% confidence</span>
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">{finding.title}</h4>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Chip label={finding.surface} />
        {finding.policyTags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700"
          >
            {tag}
          </span>
        ))}
        {finding.policyTags.length > 2 && (
          <span className="text-xs text-gray-500">+{finding.policyTags.length - 2}</span>
        )}
      </div>

      <p className="text-xs text-gray-600 line-clamp-2">{finding.whySnippet}</p>

      {finding.evidence.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="text-xs text-gray-600">{finding.evidence.length} evidence items</span>
        </div>
      )}
    </button>
  );
}


