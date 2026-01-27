import { X, TrendingUp } from 'lucide-react';
import { RoutingDecisionFlow } from './RoutingDecisionFlow';
import { Chip } from './Badges';
import type { Transaction } from '../demo/transactions';

interface TransactionDetailPanelProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionDetailPanel({ transaction, onClose }: TransactionDetailPanelProps) {
  if (!transaction) return null;

  const hasOptimization = transaction.suggestedRoute !== transaction.currentRoute;
  const uplift = transaction.suggestedApprovalProb - transaction.baselineApprovalProb;

  return (
    <div className="bg-white flex flex-col h-full rounded-2xl">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between rounded-t-2xl">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Transaction {transaction.id}</h3>
          <p className="text-sm text-gray-500 mt-1">{transaction.createdAt.toLocaleString()}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin">
        {/* Routing Decision Flow Visualization */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-6">Routing Decision Flow</h4>
          <RoutingDecisionFlow transaction={transaction} />
        </div>

        {/* Signals Used */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Signals Used</h4>
          <div className="flex flex-wrap gap-2">
            {transaction.explanation.signalsUsed.map((signal, i) => (
              <Chip key={i} label={signal} />
            ))}
          </div>
        </div>

        {/* Why Current Route */}
        {transaction.explanation.whyCurrent.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Why Current Route {transaction.currentOutcome === 'Declined' ? 'Failed' : 'Was Used'}
            </h4>
            <ul className="space-y-2">
              {transaction.explanation.whyCurrent.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Why Suggested Route is Better */}
        {transaction.explanation.whySuggested.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Why Suggested Route is Better</h4>
            <ul className="space-y-2">
              {transaction.explanation.whySuggested.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Compliance Notes */}
        {transaction.explanation.complianceNotes.length > 0 && (
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Compliance Notes</h4>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
              {transaction.explanation.complianceNotes.map((note, i) => (
                <p key={i} className="text-sm text-amber-800">
                  • {note}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

