import { Link } from 'react-router-dom';

export default function ContextGapSection() {
  return (
    <>
      <style>{`
        @property --rotate {
          syntax: "<angle>";
          initial-value: 132deg;
          inherits: false;
        }

        @keyframes spin {
          0% {
            --rotate: 0deg;
          }
          100% {
            --rotate: 360deg;
          }
        }

        .magic-card {
          background: transparent !important;
          padding: 3px !important;
          position: relative;
        }

        .magic-card::before {
          content: "";
          width: 100%;
          height: 100%;
          border-radius: 22px;
          background-image: linear-gradient(
            var(--rotate),
            #5ddcff, #3c67e3 43%, #4e00c2
          );
          position: absolute;
          z-index: 0;
          top: 0;
          left: 0;
          animation: spin 2.5s linear infinite;
        }

        .magic-card::after {
          position: absolute;
          content: "";
          top: calc(50% - 40%);
          left: 50%;
          transform: translateX(-50%);
          z-index: -1;
          height: 80%;
          width: 80%;
          filter: blur(80px);
          background-image: linear-gradient(
            var(--rotate),
            #5ddcff, #3c67e3 43%, #4e00c2
          );
          opacity: 1;
          transition: opacity 0.5s;
          animation: spin 2.5s linear infinite;
        }

        .magic-card-inner {
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(10px) saturate(180%);
          -webkit-backdrop-filter: blur(10px) saturate(180%);
          border-radius: 19px;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }
      `}</style>
      <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What payment systems see vs what actually exists
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Most routing and risk decisions are made using rigid snapshots. Revelius connects them to the live business reality.
          </p>
        </div>

        {/* Main Layout */}
        <div className="relative">
          {/* Two Column Grid */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-32">
            {/* LEFT PANEL - System View */}
            <div className="bg-white rounded-xl p-5 relative md:h-[380px] flex flex-col">
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  What payment systems see
                </p>
                <h3 className="text-xl font-bold text-gray-900">
                  Static fields and blunt labels
                </h3>
              </div>

              {/* Flowing chips */}
              <div className="flex flex-wrap gap-2 mb-2 flex-1 content-start justify-end">
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">MCC</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Country</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Risk score</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">One-time KYB</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">BIN routing tables</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Historical disputes</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Rules & thresholds</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Static categories</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Approval history</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Onboarding data</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Transaction volume</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Chargeback rate</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Manual flags</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Basic thresholds</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Processing limits</span>
                </div>
                <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-gray-700">Account age</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic">
                Accurate sometimes. Incomplete most of the time.
              </p>

              {/* Connector line (desktop only) */}
              <div className="hidden md:block absolute top-1/2 -right-8 w-8">
                <svg width="32" height="2" viewBox="0 0 32 2" fill="none" className="opacity-50">
                  <line x1="0" y1="1" x2="32" y2="1" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>
            </div>

            {/* RIGHT PANEL - Reality View */}
            <div className="bg-white rounded-xl p-5 relative md:h-[380px] flex flex-col">
              <div className="mb-4 text-right">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  What actually exists
                </p>
                <h3 className="text-xl font-bold text-gray-900">
                  A dynamic business in motion
                </h3>
              </div>

              {/* Flowing tags */}
              <div className="flex flex-wrap gap-2 mb-2 flex-1 content-start">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Products & catalogs</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Claims & promotions</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Checkout flows</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Subscription terms</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">UGC content</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Pricing changes</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Mobile experience</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Delivery signals</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Category drift</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Brand positioning</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Customer reviews</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Policy updates</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Social proof</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                  <span className="text-sm font-medium text-blue-900">Trust signals</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic text-right">
                This is where risk and eligibility actually live.
              </p>

              {/* Connector line (desktop only) */}
              <div className="hidden md:block absolute top-1/2 -left-8 w-8">
                <svg width="32" height="2" viewBox="0 0 32 2" fill="none" className="opacity-50">
                  <line x1="0" y1="1" x2="32" y2="1" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>
            </div>
          </div>

          {/* CENTER BRIDGE CARD - Overlays on desktop, between panels on mobile */}
          <div className="mt-8 md:mt-0 md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:w-[420px] z-10">
            {/* Mobile connector arrow (top) */}
            <div className="md:hidden flex justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="magic-card relative rounded-2xl overflow-visible transition-all duration-300">
              <div className="magic-card-inner">
                {/* Content */}
                <div className="relative z-10">
                <div className="text-center mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(147, 197, 253, 1)' }}>
                    Revelius
                  </p>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: 'rgba(229, 231, 235, 1)' }}>
                    Bridges the gap with structured context
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'rgba(209, 213, 219, 0.9)' }}>
                    We continuously discover what a business does, translate it into explainable signals, and feed it into routing, compliance, and evidence generation.
                  </p>
                </div>

                {/* Checkmark bullets */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: 'rgba(52, 211, 153, 1)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ color: 'rgba(229, 231, 235, 0.9)' }}>Continuous discovery</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: 'rgba(52, 211, 153, 1)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ color: 'rgba(229, 231, 235, 0.9)' }}>Structured context intelligence</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: 'rgba(52, 211, 153, 1)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ color: 'rgba(229, 231, 235, 0.9)' }}>Actionable decisions with evidence</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 flex-col sm:flex-row justify-center">
                  <Link 
                    to="/request-access" 
                    className="px-4 py-2.5 rounded-[10px] font-medium text-center text-sm transition-all"
                    style={{
                      color: '#0a0a0a',
                      border: '1px solid transparent',
                      background: 'linear-gradient(to bottom, hsl(257, 70%, 94%), hsl(257, 75%, 90%, 0.9) 33%, hsl(257, 65%, 97%, 0.9))',
                      backdropFilter: 'blur(12px) saturate(1.5) contrast(1.1)',
                      WebkitBackdropFilter: 'blur(12px) saturate(1.5) contrast(1.1)',
                      boxShadow: `
                        inset 0 0 0 0 hsl(257, 50%, 100%, 0),
                        inset -0.35em -0.35em 0.25em -0.25em hsl(257, 70%, 96%),
                        inset -0.33em -1em 0.75em -0.75em hsl(240, 65%, 94%),
                        rgba(168, 85, 247, 0.22) 0px 0.3em 0.3em 0px,
                        rgba(147, 100, 247, 0.18) 0px 0.18em 0.18em 0px,
                        rgba(120, 130, 247, 0.15) 0px 0.05em 0.05em 0px
                      `,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `
                        inset 0 0 0 0 hsl(257, 50%, 100%, 0),
                        inset -0.35em -0.35em 0.25em -0.25em hsl(257, 70%, 96%),
                        inset -0.33em -1em 0.75em -0.75em hsl(240, 65%, 94%),
                        rgba(168, 85, 247, 0.30) 0px 0.5em 0.8em 0px,
                        rgba(147, 100, 247, 0.25) 0px 0.3em 0.5em 0px,
                        rgba(120, 130, 247, 0.20) 0px 0.1em 0.2em 0px
                      `;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `
                        inset 0 0 0 0 hsl(257, 50%, 100%, 0),
                        inset -0.35em -0.35em 0.25em -0.25em hsl(257, 70%, 96%),
                        inset -0.33em -1em 0.75em -0.75em hsl(240, 65%, 94%),
                        rgba(168, 85, 247, 0.22) 0px 0.3em 0.3em 0px,
                        rgba(147, 100, 247, 0.18) 0px 0.18em 0.18em 0px,
                        rgba(120, 130, 247, 0.15) 0px 0.05em 0.05em 0px
                      `;
                    }}
                  >
                    Request access
                  </Link>
                  <Link 
                    to="/network" 
                    className="px-4 py-2.5 rounded-[10px] font-medium text-center text-sm transition-all"
                    style={{
                      color: 'rgba(229, 231, 235, 0.9)',
                      border: '1.5px solid rgba(229, 231, 235, 0.4)',
                      background: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border = '1.5px solid rgba(229, 231, 235, 0.6)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border = '1.5px solid rgba(229, 231, 235, 0.4)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    Join the network
                  </Link>
                </div>
              </div>
              </div>
            </div>

            {/* Mobile connector arrow (bottom) */}
            <div className="md:hidden flex justify-center mt-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
