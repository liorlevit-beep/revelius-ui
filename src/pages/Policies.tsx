import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Settings, Copy, CheckCircle, FileText } from 'lucide-react';
import { Card } from '../components/Card';
import { Chip } from '../components/Badges';
import { policyPacks } from '../demo/policies';

export function Policies() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [showDrafts, setShowDrafts] = useState(true);

  const filteredPacks = policyPacks.filter((pack) => {
    const matchesSearch =
      searchQuery === '' ||
      pack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = regionFilter === 'All' || pack.regions.includes(regionFilter);
    const matchesStatus = showDrafts || pack.status === 'Active';

    return matchesSearch && matchesRegion && matchesStatus;
  });

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Policy packs define eligibility gates, risk thresholds, and routing preferences.
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search policy packs…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white dark:focus:bg-white/10 transition-all"
                />
              </div>

              {/* Filters Row */}
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer [&>option]:bg-white [&>option]:dark:bg-gray-900"
                >
                  <option value="All">All Regions</option>
                  <option value="US">US</option>
                  <option value="EU">EU</option>
                  <option value="UK">UK</option>
                  <option value="IL">IL</option>
                </select>

                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={showDrafts}
                    onChange={(e) => setShowDrafts(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
                  />
                  Show drafts
                </label>

                <span className="text-sm text-gray-600 dark:text-gray-400 ml-auto">
                  {filteredPacks.length} {filteredPacks.length === 1 ? 'pack' : 'packs'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Policy Packs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPacks.map((pack) => (
            <Card key={pack.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{pack.name}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
                          pack.status === 'Active'
                            ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                            : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10'
                        }`}
                      >
                        {pack.status === 'Active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {pack.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{pack.description}</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-24">Regions</span>
                    <div className="flex flex-wrap gap-1">
                      {pack.regions.map((region) => (
                        <Chip key={region} label={region} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-24">Goal</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{pack.primaryGoal}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-24">Rules</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{pack.rulesCount} active rules</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-24">Updated</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{getRelativeTime(pack.lastUpdated)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                  <button
                    onClick={() => navigate(`/policies/${pack.id}`)}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    View pack
                  </button>
                  <button
                    onClick={() => {
                      // Demo: Show toast
                      alert(`"${pack.name}" duplicated to drafts`);
                    }}
                    className="px-4 py-2.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    title="Duplicate pack"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPacks.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <Settings className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No policy packs found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}


