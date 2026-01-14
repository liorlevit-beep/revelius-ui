import { useState, useEffect } from 'react';
import { X, FileText, Link as LinkIcon, Loader2 } from 'lucide-react';
import { RoutingCanvas } from './routing/RoutingCanvas';
import { Chip } from './Badges';
import { JsonViewer } from './JsonViewer';
import { AttachScanSessionModal } from './evidence/AttachScanSessionModal';
import { RoutingDecisionBlock } from './evidence/RoutingDecisionBlock';
import { EvidencePackView } from './evidence/EvidencePackView';
import { EvidencePackBySKU } from './evidence/EvidencePackBySKU';
import { CartRoutingDecision } from './evidence/CartRoutingDecision';
import { getEvidenceSessionId } from '../lib/evidenceBinding';
import { ScannerAPI } from '../api';
import type { Transaction } from '../demo/transactions';

interface TransactionDetailPanelProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function TransactionDetailPanel({ transaction, onClose }: TransactionDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'routing' | 'evidence'>('routing');
  const [boundSessionId, setBoundSessionId] = useState<string | null>(null);
  const [evidenceData, setEvidenceData] = useState<any>(null);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  if (!transaction) return null;

  // Load bound session ID when transaction changes
  useEffect(() => {
    if (transaction) {
      // Check transaction.evidence_session_id first (from generation), then localStorage
      const sessionId = transaction.evidence_session_id || getEvidenceSessionId(transaction.id);
      setBoundSessionId(sessionId);
      
      // If we have a session ID and we're on the evidence tab, fetch the report
      if (sessionId && activeTab === 'evidence') {
        fetchEvidenceReport(sessionId);
      }
    }
  }, [transaction?.id, transaction?.evidence_session_id, activeTab]);

  // Fetch evidence report
  const fetchEvidenceReport = async (sessionId: string) => {
    setEvidenceLoading(true);
    setEvidenceError(null);
    setEvidenceData(null);

    try {
      const response = await ScannerAPI.getJsonReport(sessionId);
      setEvidenceData(response);
    } catch (err: any) {
      setEvidenceError(err.message || 'Failed to load evidence report');
    } finally {
      setEvidenceLoading(false);
    }
  };

  // Handle session attached
  const handleSessionAttached = (sessionId: string) => {
    setBoundSessionId(sessionId);
    if (activeTab === 'evidence') {
      fetchEvidenceReport(sessionId);
    }
  };

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

      {/* Tabs */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100">
        <nav className="flex gap-8 px-8">
          <button
            onClick={() => setActiveTab('routing')}
            className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'routing'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Routing Decision
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'evidence'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Evidence
            {boundSessionId && (
              <span className="inline-flex items-center justify-center w-2 h-2 bg-emerald-500 rounded-full" />
            )}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'routing' && (
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin">
        {/* Routing Canvas Visualization */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-6">Routing Visualization</h4>
          <RoutingCanvas
            cart={transaction.cart}
            lineItems={transaction.lineItems}
            merchantName={transaction.merchantName}
            merchantCountry={transaction.country}
            selectedProvider={transaction.suggestedRoute}
            onProviderSelect={(provider) => {
              // Update the transaction's suggested route
              transaction.suggestedRoute = provider;
            }}
            height={500}
            transactionId={transaction.id}
            transactionAmount={transaction.amount}
            transactionCurrency={transaction.currency}
            itemCount={transaction.cart?.length || transaction.lineItems?.length || 0}
          />
        </div>

        {/* Cart-Based Routing Decision (for generated transactions with cart) */}
        {transaction.cart && transaction.cart.length > 0 && (
          <div className="border-t border-gray-200 pt-8">
            <h4 className="text-base font-semibold text-gray-900 mb-6">Cart Routing Analysis</h4>
            <CartRoutingDecision cart={transaction.cart} />
          </div>
        )}

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
      )}

      {/* Evidence Tab */}
      {activeTab === 'evidence' && (
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
          {/* Routing Decision Section */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Routing Decision</h4>
            <RoutingDecisionBlock lineItems={transaction.lineItems} />
          </div>

          {/* Evidence Pack Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Evidence Pack</h4>
            {boundSessionId && (
              <button
                onClick={() => setShowAttachModal(true)}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Change
              </button>
            )}
          </div>

          {/* No Session Bound - Empty State */}
          {!boundSessionId && (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <LinkIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h5 className="text-lg font-semibold text-gray-900 mb-2">No evidence attached</h5>
              <p className="text-sm text-gray-600 text-center mb-6 max-w-md">
                Attach a scan session to view compliance evidence and website analysis for this transaction.
              </p>
              <button
                onClick={() => setShowAttachModal(true)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                Attach Scan Session
              </button>
            </div>
          )}

          {/* Session Bound - Show Evidence */}
          {boundSessionId && (
            <div className="space-y-4">
              {/* Session ID Display */}
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                    Scan Session
                  </p>
                  <p className="text-sm font-mono text-emerald-700 truncate">
                    {boundSessionId}
                  </p>
                </div>
              </div>

              {/* Loading State */}
              {evidenceLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                  <p className="text-sm text-gray-600">Loading evidence report...</p>
                </div>
              )}

              {/* Error State */}
              {evidenceError && !evidenceLoading && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {evidenceError}
                  </p>
                  <button
                    onClick={() => fetchEvidenceReport(boundSessionId)}
                    className="mt-3 text-sm text-red-700 hover:text-red-900 underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Evidence Report */}
              {evidenceData && !evidenceLoading && (
                <div className="space-y-4">
                  {/* Toggle between visual and raw JSON */}
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-semibold text-gray-900">Evidence Report</h5>
                    <button
                      onClick={() => setShowRawJson(!showRawJson)}
                      className="text-xs text-gray-600 hover:text-gray-900 underline"
                    >
                      {showRawJson ? 'Show Visual Report' : 'Show Raw JSON'}
                    </button>
                  </div>

                  {/* Visual Evidence Pack - SKU-Based (for generated transactions) */}
                  {!showRawJson && transaction.cart && transaction.cart.length > 0 && transaction.evidence_summary && (
                    <EvidencePackBySKU
                      sessionId={boundSessionId}
                      rootUrl={evidenceData?.data?.root_website_url || evidenceData?.root_website_url || 'Unknown'}
                      cart={transaction.cart}
                      evidenceSummary={transaction.evidence_summary}
                      transactionId={transaction.id}
                    />
                  )}

                  {/* Visual Evidence Pack - Standard (for manually attached evidence) */}
                  {!showRawJson && (!transaction.cart || transaction.cart.length === 0) && (
                    <EvidencePackView 
                      report={evidenceData?.data || evidenceData}
                      sessionId={boundSessionId}
                      txnId={transaction.id}
                    />
                  )}

                  {/* Raw JSON Viewer (for debugging) */}
                  {showRawJson && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-x-auto">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                        <JsonViewer data={evidenceData} expanded={true} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      )}

      {/* Attach Scan Session Modal */}
      <AttachScanSessionModal
        open={showAttachModal}
        onOpenChange={setShowAttachModal}
        txnId={transaction.id}
        onAttached={handleSessionAttached}
      />
    </div>
  );
}

