import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ExternalLink, FileText } from 'lucide-react';
import { Chip } from '../Badges';
import type { Finding, Evidence } from './types';

interface FindingDrawerProps {
  finding: Finding | null;
  onClose: () => void;
  onEvidenceClick: (evidence: Evidence) => void;
}

export function FindingDrawer({ finding, onClose, onEvidenceClick }: FindingDrawerProps) {
  const navigate = useNavigate();

  if (!finding) return null;

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

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approve':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'reject':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getEvidenceTypeIcon = (type: string) => {
    switch (type) {
      case 'screenshot':
        return '📸';
      case 'text':
        return '📄';
      case 'html':
        return '🔗';
      case 'video':
        return '🎥';
      default:
        return '📋';
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:w-[700px] h-[90vh] sm:h-full sm:max-h-[90vh] rounded-t-2xl sm:rounded-l-2xl sm:rounded-r-none shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border capitalize ${getSeverityColor(finding.severity)}`}>
                {finding.severity}
              </span>
              {finding.isNew && (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-semibold">
                  New
                </span>
              )}
              <span className="text-xs text-gray-500">{finding.confidence}% confidence</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{finding.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* What we saw */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">What We Saw</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{finding.description}</p>
          </div>

          {/* Why Snippet */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Details</h4>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700">{finding.whySnippet}</p>
            </div>
          </div>

          {/* Policy Tags */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Policy Tags</h4>
            <div className="flex flex-wrap gap-2">
              {finding.policyTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Surface */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Surface</h4>
            <Chip label={finding.surface} />
          </div>

          {/* Evidence */}
          {finding.evidence.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Evidence ({finding.evidence.length})</h4>
              <div className="space-y-3">
                {finding.evidence.map((evidence) => (
                  <button
                    key={evidence.id}
                    onClick={() => onEvidenceClick(evidence)}
                    className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">{getEvidenceTypeIcon(evidence.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-medium capitalize">
                            {evidence.type}
                          </span>
                          <span className="text-xs text-gray-500">{evidence.timestamp.toLocaleString()}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1 truncate">{evidence.snippet}</p>
                        <a
                          href={evidence.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {evidence.url}
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Action (Pillar) */}
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Suggested Action (Pillar)</h4>
            
            <div className="mb-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border capitalize ${getActionColor(finding.suggestedAction)}`}>
                {finding.suggestedAction}
              </span>
            </div>

            {finding.remediationBullets.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Remediation Steps</p>
                <ul className="space-y-2">
                  {finding.remediationBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Open Scan Report */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate(`/scans/${finding.scanId}`)}
              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Open Scan Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


