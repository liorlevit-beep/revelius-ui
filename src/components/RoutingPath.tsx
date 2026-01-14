import { Check, X, AlertCircle, ArrowRight } from 'lucide-react';
import { Chip } from './Badges';
import { getCountryFlag } from '../utils/countryFlags';
import type { Transaction } from '../demo/transactions';

interface RoutingPathProps {
  transaction: Transaction;
}

export function RoutingPath({ transaction }: RoutingPathProps) {
  const isDeclined = transaction.currentOutcome === 'Declined';
  const hasOptimization = transaction.suggestedRoute !== transaction.currentRoute;

  return (
    <div className="space-y-6">
      {/* Step 1: Inputs */}
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-bold text-blue-700">1</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Transaction Context</h4>
            <div className="flex flex-wrap gap-2">
              <Chip label={`${transaction.amount} ${transaction.currency}`} />
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                title={transaction.country}
              >
                <span className="text-lg leading-none">{getCountryFlag(transaction.country)}</span>
              </span>
              <Chip label={transaction.method} />
              <Chip label={transaction.merchantName} />
            </div>
          </div>
        </div>
        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
      </div>

      {/* Step 2: Risk Gates */}
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-sm font-bold text-amber-700">2</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Risk Assessment</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-gray-700">
                  {transaction.riskSignals.length} risk signal(s) detected
                </span>
              </div>
              {transaction.riskSignals.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {transaction.riskSignals.map((signal, i) => (
                    <Chip key={i} label={signal} />
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Baseline approval probability: {transaction.baselineApprovalProb.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
      </div>

      {/* Step 3: Route Decision */}
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-sm font-bold text-purple-700">3</span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Routing Decision</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Current Route */}
              <div className={`p-4 rounded-xl border-2 ${
                isDeclined ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <p className="text-xs font-medium text-gray-500 mb-1">Current Route</p>
                <p className="text-base font-bold text-gray-900 mb-2">{transaction.currentRoute}</p>
                <div className="flex items-center gap-2">
                  {isDeclined ? (
                    <X className="w-4 h-4 text-red-600" />
                  ) : (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                  <span className={`text-sm font-semibold ${
                    isDeclined ? 'text-red-700' : 'text-emerald-700'
                  }`}>
                    {transaction.currentOutcome}
                  </span>
                </div>
              </div>

              {/* Suggested Route */}
              {hasOptimization && (
                <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-medium text-emerald-600">Suggested Route</p>
                    <ArrowRight className="w-3 h-3 text-emerald-600" />
                  </div>
                  <p className="text-base font-bold text-emerald-900 mb-2">{transaction.suggestedRoute}</p>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">
                      {transaction.suggestedApprovalProb.toFixed(1)}% prob
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
      </div>

      {/* Step 4: Outcome */}
      <div>
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isDeclined ? 'bg-red-100' : 'bg-emerald-100'
          }`}>
            <span className={`text-sm font-bold ${
              isDeclined ? 'text-red-700' : 'text-emerald-700'
            }`}>
              4
            </span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Outcome & Impact</h4>
            {hasOptimization && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-emerald-900">Potential Uplift</span>
                  <span className="text-lg font-bold text-emerald-700">
                    +{(transaction.suggestedApprovalProb - transaction.baselineApprovalProb).toFixed(1)}pp
                  </span>
                </div>
                <p className="text-xs text-emerald-700">
                  Switching to {transaction.suggestedRoute} could increase approval probability
                </p>
              </div>
            )}
            {!hasOptimization && !isDeclined && (
              <p className="text-sm text-gray-600">
                Current routing is optimal for this transaction.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


