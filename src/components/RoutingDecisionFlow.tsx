import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Chip } from './Badges';
import type { Transaction, RouteCandidate } from '../demo/transactions';

interface RoutingDecisionFlowProps {
  transaction: Transaction;
}

export function RoutingDecisionFlow({ transaction }: RoutingDecisionFlowProps) {
  const navigate = useNavigate();
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);

  const getEligibilityBadge = (eligibility: string) => {
    if (eligibility === 'eligible') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (eligibility === 'warning') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getComplianceBadge = (fit: string) => {
    if (fit === 'good') return 'bg-emerald-50 text-emerald-700';
    if (fit === 'ok') return 'bg-amber-50 text-amber-700';
    return 'bg-red-50 text-red-700';
  };

  const baselineCandidate = transaction.routing.candidates.find(c => c.decision === 'baseline');
  const selectedCandidate = transaction.routing.candidates.find(c => c.decision === 'selected');
  const uplift = selectedCandidate && baselineCandidate
    ? (selectedCandidate.approvalProb - baselineCandidate.approvalProb) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Main Flow Visualization */}
      <div className="relative">
        {/* Desktop Layout - Horizontal */}
        <div className="hidden lg:block">
          <div className="relative flex items-start gap-8 py-8" style={{ minHeight: '500px' }}>
            {/* SVG Connections - positioned absolutely behind cards */}
            <svg
              className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible"
              style={{ zIndex: 0 }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
                </marker>
              </defs>
              {/* Curved lines from Revelius to each route */}
              {transaction.routing.candidates.map((candidate, idx) => {
                const isSelected = candidate.decision === 'selected';
                const strokeColor = isSelected ? '#10b981' : '#d1d5db';
                
                return (
                  <g key={idx}>
                    <path
                      d={`M 64% 100 Q 68% ${80 + (idx * 100)} 68% ${100 + (idx * 100)}`}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? '2.5' : '2'}
                      fill="none"
                      opacity={isSelected ? '0.7' : '0.4'}
                      markerEnd="url(#arrowhead)"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Column 1: Transaction Card */}
            <div className="w-1/3 relative z-10">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Transaction</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {transaction.amount} {transaction.currency}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-medium">{transaction.country}</span>
                    <span className="text-gray-400">•</span>
                    <span>{transaction.method}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/merchants/${transaction.merchantId}`)}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {transaction.merchantName}
                  </button>
                  {transaction.riskSignals.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-2">Risk Signals</p>
                      <div className="flex flex-wrap gap-1.5">
                        {transaction.riskSignals.slice(0, 4).map((signal, i) => (
                          <Chip key={i} label={signal} />
                        ))}
                        {transaction.riskSignals.length > 4 && (
                          <span className="text-xs text-gray-500">+{transaction.riskSignals.length - 4}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: Revelius Decision Node */}
            <div className="w-1/3 relative z-10">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">R</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Revelius Routing</h4>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Filters routes by policy + context, then ranks by approvals, cost, and risk.
                </p>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Signals Used</p>
                  <div className="space-y-1">
                    {transaction.explanation.signalsUsed.slice(0, 4).map((signal, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-gray-700">{signal}</span>
                      </div>
                    ))}
                    {transaction.explanation.signalsUsed.length > 4 && (
                      <p className="text-xs text-gray-500 pl-3">
                        +{transaction.explanation.signalsUsed.length - 4} more
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Route Cards */}
            <div className="w-1/3 relative z-10 space-y-3">
              {transaction.routing.candidates.map((candidate) => (
                <RouteCard
                  key={candidate.routeId}
                  candidate={candidate}
                  expanded={expandedRoute === candidate.routeId}
                  onToggle={() => setExpandedRoute(expandedRoute === candidate.routeId ? null : candidate.routeId)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout - Vertical Stack */}
        <div className="lg:hidden space-y-4">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Transaction</h4>
            <p className="text-xl font-bold text-gray-900 mb-2">
              {transaction.amount} {transaction.currency}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              {transaction.country} • {transaction.method}
            </p>
            <button
              onClick={() => navigate(`/merchants/${transaction.merchantId}`)}
              className="text-sm font-medium text-emerald-600"
            >
              {transaction.merchantName}
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-4">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Revelius Routing</h4>
            <p className="text-xs text-gray-600 mb-3">
              Filters routes by policy + context, then ranks by approvals, cost, and risk.
            </p>
          </div>

          <div className="space-y-2">
            {transaction.routing.candidates.map((candidate) => (
              <RouteCard
                key={candidate.routeId}
                candidate={candidate}
                expanded={expandedRoute === candidate.routeId}
                onToggle={() => setExpandedRoute(expandedRoute === candidate.routeId ? null : candidate.routeId)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Uplift Summary */}
      {selectedCandidate && baselineCandidate && selectedCandidate !== baselineCandidate && (
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-5">
          <h4 className="text-sm font-bold text-gray-900 mb-4">Optimization Impact</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Baseline Approval</p>
              <p className="text-xl font-bold text-gray-900">
                {(baselineCandidate.approvalProb * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Optimized Approval</p>
              <p className="text-xl font-bold text-emerald-600">
                {(selectedCandidate.approvalProb * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Uplift</p>
              <p className="text-xl font-bold text-emerald-700">
                +{uplift.toFixed(1)}pp
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-200">
            <p className="text-xs font-medium text-gray-600">
              Estimated incremental revenue: <span className="font-bold text-emerald-700">
                ${(transaction.amount * (uplift / 100) * 0.03).toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface RouteCardProps {
  candidate: RouteCandidate;
  expanded: boolean;
  onToggle: () => void;
}

function RouteCard({ candidate, expanded, onToggle }: RouteCardProps) {
  const navigate = useNavigate();

  const getEligibilityLabel = (eligibility: string) => {
    if (eligibility === 'eligible') return 'Eligible';
    if (eligibility === 'warning') return 'Needs Review';
    return 'Ineligible';
  };

  const getEligibilityBadge = (eligibility: string) => {
    if (eligibility === 'eligible') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (eligibility === 'warning') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getComplianceBadge = (fit: string) => {
    if (fit === 'good') return 'bg-emerald-50 text-emerald-700';
    if (fit === 'ok') return 'bg-amber-50 text-amber-700';
    return 'bg-red-50 text-red-700';
  };

  const isSelected = candidate.decision === 'selected';
  const isBaseline = candidate.decision === 'baseline';
  const isRejected = candidate.decision === 'rejected';

  return (
    <div
      className={`rounded-xl p-4 transition-all cursor-pointer ${
        isSelected
          ? 'bg-emerald-50 border-2 border-emerald-500 shadow-md'
          : isBaseline
          ? 'bg-blue-50 border-2 border-blue-300'
          : isRejected
          ? 'bg-gray-50 border border-gray-300 opacity-60'
          : 'bg-white border border-gray-200'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
            isSelected ? 'bg-emerald-600 text-white' :
            isBaseline ? 'bg-blue-600 text-white' :
            'bg-gray-300 text-gray-700'
          }`}>
            {candidate.logoText}
          </div>
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/providers/${candidate.routeId}`);
              }}
              className="text-sm font-bold text-gray-900 hover:text-emerald-600 transition-colors text-left"
            >
              {candidate.displayName}
            </button>
            {isSelected && (
              <span className="text-xs font-semibold text-emerald-700 block">✓ Selected</span>
            )}
            {isBaseline && (
              <span className="text-xs font-semibold text-blue-700 block">Current</span>
            )}
            {isRejected && (
              <span className="text-xs font-semibold text-gray-500 block">Rejected</span>
            )}
          </div>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getEligibilityBadge(candidate.eligibility)}`}>
            {getEligibilityLabel(candidate.eligibility)}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getComplianceBadge(candidate.complianceFit)}`}>
            Compliance: {candidate.complianceFit}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-500">Approval</p>
            <p className="font-bold text-gray-900">{(candidate.approvalProb * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-500">Cost</p>
            <p className="font-bold text-gray-900">{candidate.costBps} bps</p>
          </div>
        </div>

        {!expanded && candidate.reasons.length > 0 && (
          <p className="text-xs text-gray-600 truncate">
            {candidate.reasons[0]}
          </p>
        )}

        {expanded && candidate.reasons.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
            <p className="text-xs font-semibold text-gray-700">Reasons:</p>
            {candidate.reasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-xs text-gray-700">{reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

