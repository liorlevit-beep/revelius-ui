import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Columns3, ChevronUp, ChevronDown, RefreshCw, Copy, Check, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Chip } from '../components/Badges';
import { TransactionDetailPanel } from '../components/TransactionDetailPanel';
import { UpliftKpis, UpliftChart, BreakdownTable } from '../components/UpliftComponents';
import { useTableSort } from '../hooks/useTableSort';
import { CountryFlag } from '../components/CountryFlag';
import { SelectScanModal } from '../components/transactions/SelectScanModal';
import { buildTransactionFromSession } from '../lib/transactions/buildTransactionFromScan';
import { transactionsStore } from '../lib/transactions/transactionsStore';
import { useRoutingTable } from '../hooks/useRoutingTable';
import {
  transactions as defaultTransactions,
  generateTransactions,
  upliftSeries,
  upliftBreakdownByCountry,
  upliftBreakdownByRoute,
  generateUpliftByRoute,
  getUpliftMetrics,
  type Transaction,
} from '../demo/transactions';
import { merchants } from '../demo/merchants';

type SortColumn = 'id' | 'merchantName' | 'amount' | 'country' | 'method' | 'currentRoute' | 'currentOutcome' | 'createdAt' | null;
type SortDirection = 'asc' | 'desc' | null;

interface ColumnVisibility {
  id: boolean;
  merchant: boolean;
  amount: boolean;
  country: boolean;
  method: boolean;
  route: boolean;
  outcome: boolean;
  signals: boolean;
  created: boolean;
}

const COLUMNS_STORAGE_KEY = 'transactionsTable.columns';
const PAGE_SIZE_STORAGE_KEY = 'transactionsTable.pageSize';

const defaultColumnVisibility: ColumnVisibility = {
  id: true,
  merchant: true,
  amount: true,
  country: true,
  method: true,
  route: true,
  outcome: true,
  signals: true,
  created: true,
};

export function Transactions() {
  const navigate = useNavigate();
  const { providers, defaultPsp, error: routingTableError } = useRoutingTable();
  const [activeTab, setActiveTab] = useState<'feed' | 'uplift'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [merchantFilter, setMerchantFilter] = useState('All');
  const [outcomeFilter, setOutcomeFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [routeFilter, setRouteFilter] = useState('All');
  const [dateRange, setDateRange] = useState('7');
  const [showOptimizationsOnly, setShowOptimizationsOnly] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Generate demo transactions based on routing table providers
  const demoTransactions = useMemo(() => {
    return providers.length > 0 ? generateTransactions(providers) : defaultTransactions;
  }, [providers]);
  
  // Generate uplift breakdown by route based on providers
  const dynamicUpliftByRoute = useMemo(() => {
    return providers.length > 0 ? generateUpliftByRoute(providers) : upliftBreakdownByRoute;
  }, [providers]);
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Hydrate from store (persisted transactions) + demo transactions
    const persistedTransactions = transactionsStore.list();
    return [...persistedTransactions, ...demoTransactions];
  });
  
  // Update transactions when providers change
  useEffect(() => {
    const persistedTransactions = transactionsStore.list();
    setTransactions([...persistedTransactions, ...demoTransactions]);
  }, [demoTransactions]);
  const [pageSize, setPageSize] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(PAGE_SIZE_STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 25;
    } catch {
      return 25;
    }
  });
  const columnsMenuRef = useRef<HTMLDivElement>(null);

  // Load column visibility from localStorage
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => {
    try {
      const stored = localStorage.getItem(COLUMNS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultColumnVisibility;
    } catch {
      return defaultColumnVisibility;
    }
  });

  // Save column visibility to localStorage
  useEffect(() => {
    localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  // Save page size to localStorage
  useEffect(() => {
    localStorage.setItem(PAGE_SIZE_STORAGE_KEY, pageSize.toString());
  }, [pageSize]);

  // Subscribe to transactions store changes
  useEffect(() => {
    const unsubscribe = transactionsStore.subscribe(() => {
      const persistedTransactions = transactionsStore.list();
      setTransactions([...persistedTransactions, ...demoTransactions]);
    });
    return unsubscribe;
  }, []);

  // Close columns menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target as Node)) {
        setShowColumnsMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    const now = new Date();
    const daysAgo = parseInt(dateRange) === 24 
      ? new Date(now.getTime() - 24 * 60 * 60 * 1000)
      : new Date(now.getTime() - parseInt(dateRange) * 24 * 60 * 60 * 1000);

    let result = transactions.filter((txn) => {
      const matchesSearch =
        searchQuery === '' ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMerchant = merchantFilter === 'All' || txn.merchantId === merchantFilter;
      const matchesOutcome = outcomeFilter === 'All' || txn.currentOutcome === outcomeFilter;
      const matchesMethod = methodFilter === 'All' || txn.method === methodFilter;
      const matchesRoute = routeFilter === 'All' || txn.currentRoute === routeFilter;
      const matchesDate = txn.createdAt >= daysAgo;
      const matchesOptimization = !showOptimizationsOnly || txn.suggestedRoute !== txn.currentRoute;

      return matchesSearch && matchesMerchant && matchesOutcome && matchesMethod && 
             matchesRoute && matchesDate && matchesOptimization;
    });

    // Apply sorting
    if (sortColumn && sortDirection) {
      result = [...result].sort((a, b) => {
        let aVal: any;
        let bVal: any;

        switch (sortColumn) {
          case 'id':
            aVal = a.id;
            bVal = b.id;
            break;
          case 'merchantName':
            aVal = a.merchantName;
            bVal = b.merchantName;
            break;
          case 'amount':
            aVal = a.amount;
            bVal = b.amount;
            break;
          case 'country':
            aVal = a.country;
            bVal = b.country;
            break;
          case 'method':
            aVal = a.method;
            bVal = b.method;
            break;
          case 'currentRoute':
            aVal = a.currentRoute;
            bVal = b.currentRoute;
            break;
          case 'currentOutcome':
            aVal = a.currentOutcome;
            bVal = b.currentOutcome;
            break;
          case 'createdAt':
            aVal = a.createdAt.getTime();
            bVal = b.createdAt.getTime();
            break;
          default:
            return 0;
        }

        // Handle string comparison
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        // Handle numeric comparison
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return result;
  }, [searchQuery, merchantFilter, outcomeFilter, methodFilter, routeFilter, dateRange, showOptimizationsOnly, sortColumn, sortDirection]);

  // Paginated data
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedTransactions.slice(start, start + pageSize);
  }, [filteredAndSortedTransactions, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, merchantFilter, outcomeFilter, methodFilter, routeFilter, dateRange, showOptimizationsOnly, pageSize]);

  const upliftMetrics = getUpliftMetrics(filteredAndSortedTransactions);
  const currentUpliftSeries = dateRange === '24' ? upliftSeries[24] : dateRange === '7' ? upliftSeries[7] : upliftSeries[30];

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleCopyId = (txnId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(txnId);
    setCopiedId(txnId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> none
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleRefresh = () => {
    setLoading(true);
    // Refresh from store
    setTimeout(() => {
      const persistedTransactions = transactionsStore.list();
      const freshDemoTransactions = providers.length > 0 ? generateTransactions(providers) : defaultTransactions;
      setTransactions([...persistedTransactions, ...freshDemoTransactions]);
      setLoading(false);
    }, 500);
  };

  const handleSessionSelected = async (sessionId: string, url: string) => {
    setGenerating(true);
    
    try {
      // Build transaction from scan report
      const transactionData = await buildTransactionFromSession(sessionId);
      
      // Generate new transaction ID
      const txnId = `TXN-${Date.now().toString().slice(-8)}`;

      // Create new transaction with data from scan
      const selectedPsp = defaultPsp || providers[0] || 'stripe';
      
      const newTransaction: Transaction = {
        id: txnId,
        merchantId: 'generated',
        merchantName: transactionData.merchantName || 'Unknown Merchant',
        amount: transactionData.amount || 0,
        currency: 'USD',
        country: 'USA',
        method: 'Card',
        currentRoute: selectedPsp,
        suggestedRoute: selectedPsp,
        currentOutcome: 'Approved',
        riskSignals: transactionData.cart && transactionData.cart.length > 0 ? ['Evidence-based cart'] : [],
        createdAt: new Date(),
        status: 'authorized',
        evidence_session_id: sessionId,
        cart: transactionData.cart || [],
        evidence_summary: transactionData.evidence_summary,
        lineItems: [],
        baselineApprovalProb: 0.85,
        suggestedApprovalProb: 0.85,
        explanation: {
          signalsUsed: ['Scan session attached', `${transactionData.cart?.length || 0} SKUs from scan`],
          whyCurrent: ['Generated from scan session'],
          whySuggested: ['Generated from scan session'],
          complianceNotes: [`Evidence from scan session ${sessionId}`, `${transactionData.evidence_summary?.total_scanned_items || 0} items scanned`],
        },
      };

      // Save to persistent store
      transactionsStore.add(newTransaction);

      // Select and open the new transaction
      setSelectedTransaction(newTransaction);

      // Switch to feed tab if not already there
      setActiveTab('feed');

      // Reset to first page
      setCurrentPage(1);
    } catch (error: any) {
      console.error('Failed to build transaction from scan:', error);
      alert(`Failed to generate transaction: ${error.message || 'Unknown error'}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <div className="p-8">
        {/* Tabs */}
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-t-2xl border border-gray-100 dark:border-white/10 border-b-0">
          <nav className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab('feed')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'feed'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('uplift')}
              className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'uplift'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Uplift
            </button>
          </nav>
        </div>

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-b-2xl border border-gray-100 dark:border-white/10 shadow-sm">
            {/* Controls */}
            <div className="p-6 border-b border-gray-100 dark:border-white/10">
              <div className="flex flex-col gap-4">
                {/* Search and Generate Button Row */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by txn ID, merchant, country…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white dark:focus:bg-white/10 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => setShowGenerateModal(true)}
                    disabled={generating}
                    className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Generate from Scan
                      </>
                    )}
                  </button>
                </div>

                {/* Filters Row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={merchantFilter}
                    onChange={(e) => setMerchantFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer [&>option]:bg-white [&>option]:dark:bg-gray-900 [&>option]:text-gray-900 [&>option]:dark:text-white"
                  >
                    <option value="All">All Merchants</option>
                    {merchants.slice(0, 10).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={outcomeFilter}
                    onChange={(e) => setOutcomeFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer [&>option]:bg-white [&>option]:dark:bg-gray-900 [&>option]:text-gray-900 [&>option]:dark:text-white"
                  >
                    <option value="All">All Outcomes</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                  </select>

                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer [&>option]:bg-white [&>option]:dark:bg-gray-900 [&>option]:text-gray-900 [&>option]:dark:text-white"
                  >
                    <option value="All">All Methods</option>
                    <option value="Card">Card</option>
                    <option value="APM">APM</option>
                    <option value="Wallet">Wallet</option>
                    <option value="Bank transfer">Bank transfer</option>
                  </select>

                  <select
                    value={routeFilter}
                    onChange={(e) => setRouteFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer [&>option]:bg-white [&>option]:dark:bg-gray-900 [&>option]:text-gray-900 [&>option]:dark:text-white"
                  >
                    <option value="All">All Routes</option>
                    {providers.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                  
                  {/* Fallback indicator */}
                  {routingTableError && (
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                      title={`Using fallback providers: ${routingTableError}`}
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Offline mode
                    </span>
                  )}

                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer [&>option]:bg-white [&>option]:dark:bg-gray-900 [&>option]:text-gray-900 [&>option]:dark:text-white"
                  >
                    <option value="24">Last 24 hours</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                  </select>

                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={showOptimizationsOnly}
                      onChange={(e) => setShowOptimizationsOnly(e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
                    />
                    Optimizations only
                  </label>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredAndSortedTransactions.length} {filteredAndSortedTransactions.length === 1 ? 'transaction' : 'transactions'}
                  </div>

                  {/* Column Visibility Control */}
                  <div className="relative" ref={columnsMenuRef}>
                    <button
                      onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                      className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
                      title="Toggle columns"
                    >
                      <Columns3 className="w-4 h-4" />
                      Columns
                    </button>

                    {showColumnsMenu && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 shadow-lg z-20 py-2">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-white/10">
                          Show Columns
                        </div>
                        {Object.entries(columnVisibility).map(([key, value]) => (
                          <label
                            key={key}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => toggleColumn(key as keyof ColumnVisibility)}
                              className="w-4 h-4 text-emerald-600 border-gray-300 dark:border-gray-600 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                              {key === 'id' ? 'Txn ID' : key === 'created' ? 'Created' : key}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh transactions"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 450px)' }}>
              <table className="w-full table-fixed">
                <thead className="bg-gray-50/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 sticky top-0 z-10">
                  <tr>
                    {columnVisibility.id && (
                      <th 
                        onClick={() => handleSort('id')}
                        className="group text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 dark:hover:bg-white/5 transition-colors relative select-none w-[15%]"
                      >
                        <div className="flex items-center gap-2">
                          Txn ID
                          {sortColumn === 'id' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'id' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'id' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.merchant && (
                      <th 
                        onClick={() => handleSort('merchantName')}
                        className="group text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 dark:hover:bg-white/5 transition-colors relative select-none w-[15%]"
                      >
                        <div className="flex items-center gap-2">
                          Merchant
                          {sortColumn === 'merchantName' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'merchantName' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'merchantName' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.amount && (
                      <th 
                        onClick={() => handleSort('amount')}
                        className="group text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 dark:hover:bg-white/5 transition-colors relative select-none w-[10%]"
                      >
                        <div className="flex items-center gap-2">
                          Amount
                          {sortColumn === 'amount' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'amount' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'amount' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.country && (
                      <th 
                        onClick={() => handleSort('country')}
                        className="group text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 dark:hover:bg-white/5 transition-colors relative select-none w-[10%]"
                      >
                        <div className="flex items-center gap-2">
                          Country
                          {sortColumn === 'country' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'country' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'country' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.method && (
                      <th 
                        onClick={() => handleSort('method')}
                        className="group text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 dark:hover:bg-white/5 transition-colors relative select-none w-[12%]"
                      >
                        <div className="flex items-center gap-2">
                          Method
                          {sortColumn === 'method' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'method' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'method' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.route && (
                      <th 
                        onClick={() => handleSort('currentRoute')}
                        className="group text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 dark:hover:bg-white/5 transition-colors relative select-none w-[13%]"
                      >
                        <div className="flex items-center gap-2">
                          Route
                          {sortColumn === 'currentRoute' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'currentRoute' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'currentRoute' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.outcome && (
                      <th 
                        onClick={() => handleSort('currentOutcome')}
                        className="group text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 dark:hover:bg-white/5 transition-colors relative select-none w-[10%]"
                      >
                        <div className="flex items-center gap-2">
                          Outcome
                          {sortColumn === 'currentOutcome' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'currentOutcome' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'currentOutcome' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.created && (
                      <th 
                        onClick={() => handleSort('createdAt')}
                        className="group text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100/80 dark:hover:bg-white/5 transition-colors relative select-none w-[14%]"
                      >
                        <div className="flex items-center gap-2">
                          Created
                          {sortColumn === 'createdAt' && sortDirection === 'asc' && (
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn === 'createdAt' && sortDirection === 'desc' && (
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {sortColumn !== 'createdAt' && (
                            <ChevronUp className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </th>
                    )}
                    {columnVisibility.signals && (
                      <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 px-4 whitespace-nowrap w-[15%]">
                        Signals
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {paginatedTransactions.map((txn, idx) => {
                    const hasOptimization = txn.suggestedRoute !== txn.currentRoute;
                    return (
                      <tr
                        key={`${txn.id}-${idx}`}
                        className={`group relative hover:bg-gray-50/80 dark:hover:bg-white/5 cursor-pointer transition-all duration-150 active:scale-[0.998] ${
                          selectedTransaction?.id === txn.id ? 'bg-emerald-50 dark:bg-emerald-500/10' : ''
                        }`}
                        onClick={() => setSelectedTransaction(txn)}
                      >
                        {columnVisibility.id && (
                          <td className="py-3 px-4 whitespace-nowrap relative border-l-2 border-transparent group-hover:border-emerald-500 transition-colors duration-150 w-[15%]">
                            <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
                              <span className="text-sm font-mono text-gray-900 dark:text-white truncate">{txn.id}</span>
                              {hasOptimization && (
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" title="Optimization opportunity" />
                              )}
                              {txn.evidence_session_id && (
                                <span 
                                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 flex-shrink-0"
                                  title={`Bound to scan session ${txn.evidence_session_id}`}
                                >
                                  Evidence
                                </span>
                              )}
                              <button
                                onClick={(e) => handleCopyId(txn.id, e)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors flex-shrink-0"
                                title="Copy transaction ID"
                              >
                                {copiedId === txn.id ? (
                                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                )}
                              </button>
                            </div>
                          </td>
                        )}
                        {columnVisibility.merchant && (
                          <td className={`py-3 px-4 whitespace-nowrap w-[15%] ${!columnVisibility.id ? 'border-l-2 border-transparent group-hover:border-emerald-500 transition-colors duration-150' : ''}`}>
                            <div className="flex flex-col gap-0.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/merchants/${txn.merchantId}`);
                                }}
                                className="text-sm font-medium text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block truncate max-w-full text-left"
                              >
                                {txn.merchantName}
                              </button>
                              {txn.evidence_summary && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {txn.evidence_summary.total_scanned_items} items scanned
                                </span>
                              )}
                            </div>
                          </td>
                        )}
                        {columnVisibility.amount && (
                          <td className="py-3 px-4 whitespace-nowrap w-[10%]">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white block truncate">
                              {txn.amount} {txn.currency}
                            </span>
                          </td>
                        )}
                        {columnVisibility.country && (
                          <td className="py-3 px-4 whitespace-nowrap w-[10%]">
                            <div className="flex items-center justify-center">
                              <CountryFlag country={txn.country} />
                            </div>
                          </td>
                        )}
                        {columnVisibility.method && (
                          <td className="py-3 px-4 whitespace-nowrap w-[12%]">
                            <span className="text-sm text-gray-700 dark:text-gray-300 block truncate">{txn.method}</span>
                          </td>
                        )}
                        {columnVisibility.route && (
                          <td className="py-3 px-4 whitespace-nowrap w-[13%]">
                            <span className="text-sm font-medium text-gray-900 dark:text-white block truncate">{txn.currentRoute}</span>
                          </td>
                        )}
                        {columnVisibility.outcome && (
                          <td className="py-3 px-4 whitespace-nowrap w-[10%]">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                                txn.currentOutcome === 'Approved'
                                  ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                  : 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                              }`}
                            >
                              {txn.currentOutcome}
                            </span>
                          </td>
                        )}
                        {columnVisibility.created && (
                          <td className="py-3 px-4 whitespace-nowrap w-[14%]">
                            <span className="text-sm text-gray-700 dark:text-gray-300 block truncate">
                              {txn.createdAt.toLocaleString()}
                            </span>
                          </td>
                        )}
                        {columnVisibility.signals && (
                          <td className="py-3 px-4 whitespace-nowrap w-[15%]">
                            <div className="flex items-center gap-1 overflow-hidden">
                              {txn.riskSignals.slice(0, 1).map((signal, i) => (
                                <Chip key={i} label={signal} />
                              ))}
                              {txn.riskSignals.length > 1 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">+{txn.riskSignals.length - 1}</span>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredAndSortedTransactions.length > 0 && (
              <div className="border-t border-gray-100 dark:border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, filteredAndSortedTransactions.length)} of{' '}
                    {filteredAndSortedTransactions.length} transactions
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</label>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer [&>option]:bg-white [&>option]:dark:bg-gray-900"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Uplift Tab */}
        {activeTab === 'uplift' && (
          <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-b-2xl border border-gray-100 dark:border-white/10 shadow-sm p-6 space-y-6">
            {/* KPI Cards */}
            <UpliftKpis
              baselineRate={upliftMetrics.baselineRate}
              optimizedRate={upliftMetrics.optimizedRate}
              uplift={upliftMetrics.uplift}
              incrementalApprovals={upliftMetrics.incrementalApprovals}
              incrementalVolume={upliftMetrics.incrementalVolume}
              revenueUplift={upliftMetrics.revenueUplift}
            />

            {/* Chart */}
            <UpliftChart data={currentUpliftSeries} showHourly={dateRange === '24'} />

            {/* Breakdown Tables */}
            <div className="grid grid-cols-2 gap-6">
              <BreakdownTable title="Uplift by Country" data={upliftBreakdownByCountry} />
              <BreakdownTable title="Uplift by Route" data={dynamicUpliftByRoute} />
            </div>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div 
          className="fixed bg-black/50 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setSelectedTransaction(null)}
          style={{ 
            position: 'fixed',
            left: 0, 
            right: 0, 
            top: 0, 
            bottom: 0,
            zIndex: 99999
          }}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <TransactionDetailPanel
              transaction={selectedTransaction}
              onClose={() => setSelectedTransaction(null)}
            />
          </div>
        </div>
      )}

      {/* Select Scan Modal */}
      <SelectScanModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
      />
    </div>
  );
}
