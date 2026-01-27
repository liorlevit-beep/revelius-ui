import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Copy, Check, ChevronRight, ChevronDown, Book, Terminal, Shield, Code2, Zap, FileText, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import GlossyButton from '../components/GlossyButton';

// Dashboard URL - GitHub Pages or production
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 
  (import.meta.env.PROD ? 'https://liorlevit-beep.github.io/revelius-ui/app' : 'http://localhost:5174');

// Code block with copy functionality
function CodeBlock({ children, language = 'json' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium transition-all duration-200 flex items-center gap-2 opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm border border-gray-700">
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}

// Inline code
function InlineCode({ children }) {
  return (
    <code className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  );
}

// Callout component
function Callout({ type = 'info', title, children }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    danger: 'bg-red-50 border-red-200 text-red-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900'
  };

  const icons = {
    info: <FileText className="w-5 h-5" />,
    warning: <Shield className="w-5 h-5" />,
    danger: <Shield className="w-5 h-5" />,
    success: <Check className="w-5 h-5" />
  };

  return (
    <div className={`border-l-4 ${styles[type]} p-4 my-6 rounded-r-lg`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icons[type]}
        </div>
        <div className="flex-1">
          {title && <p className="font-bold mb-2">{title}</p>}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Endpoint component
function Endpoint({ method, path, children }) {
  const methodColors = {
    GET: 'bg-blue-100 text-blue-700 border-blue-200',
    POST: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    PUT: 'bg-orange-100 text-orange-700 border-orange-200',
    DELETE: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className="my-6 border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <span className={`px-3 py-1 rounded-lg font-bold text-xs ${methodColors[method]} border`}>
          {method}
        </span>
        <code className="text-gray-900 font-mono text-sm">{path}</code>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

export default function Docs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState(['getting-started', 'api-reference']);

  // Navigation structure
  const navigation = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Book className="w-4 h-4" />,
      items: [
        { id: 'overview', title: 'Overview', href: '#overview' },
        { id: 'authentication', title: 'Authentication', href: '#authentication' },
        { id: 'quickstart', title: 'Quick Start', href: '#quickstart' }
      ]
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: <Terminal className="w-4 h-4" />,
      items: [
        { id: 'scanner-api', title: 'Scanner API', href: '#scanner-api' },
        { id: 'routing-api', title: 'Routing API', href: '#routing-api' },
        { id: 'merchants-api', title: 'Merchants API', href: '#merchants-api' },
        { id: 'auth-api', title: 'Auth API', href: '#auth-api' }
      ]
    },
    {
      id: 'guides',
      title: 'Guides',
      icon: <Zap className="w-4 h-4" />,
      items: [
        { id: 'typical-flow', title: 'Integration Flow', href: '#typical-flow' },
        { id: 'webhooks', title: 'Webhooks', href: '#webhooks' },
        { id: 'best-practices', title: 'Best Practices', href: '#best-practices' }
      ]
    }
  ];

  // Table of contents for current page
  const tableOfContents = [
    { id: 'overview', title: 'Overview' },
    { id: 'authentication', title: 'Authentication' },
    { id: 'quickstart', title: 'Quick Start' },
    { id: 'scanner-api', title: 'Scanner API' },
    { id: 'routing-api', title: 'Routing API' },
    { id: 'merchants-api', title: 'Merchants API' },
    { id: 'auth-api', title: 'Auth API' },
    { id: 'typical-flow', title: 'Integration Flow' },
    { id: 'webhooks', title: 'Webhooks' },
    { id: 'best-practices', title: 'Best Practices' }
  ];

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    tableOfContents.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-bold text-gray-900">Documentation</h1>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Navigation */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-40
          w-72 h-screen
          bg-white border-r border-gray-200
          overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            {/* Logo/Title */}
            <div className="mb-6 hidden lg:block">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                <Code2 className="w-6 h-6" />
                Revelius Docs
              </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {navigation.map((section) => (
                <div key={section.id} className="mb-4">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {section.icon}
                      {section.title}
                    </div>
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {expandedSections.includes(section.id) && (
                    <div className="mt-1 ml-6 space-y-1">
                      {section.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`
                            w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors
                            ${activeSection === item.id
                              ? 'text-blue-600 bg-blue-50 font-medium'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }
                          `}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Need help?</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Contact our team for integration support
                </p>
                <Link
                  to="/contact"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                >
                  Contact support <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
              <Link to="/" className="hover:text-gray-900">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Documentation</span>
            </nav>

            {/* Page Header */}
            <div className="mb-12">
              <h1 className="text-5xl font-bold mb-4 text-gray-900">Documentation</h1>
              <p className="text-xl text-gray-600">
                Integrate the Revelius Intelligence Layer into your payment stack
              </p>
            </div>

            {/* Overview */}
            <section id="overview" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Book className="w-5 h-5 text-white" />
                </div>
                Overview
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  The Revelius API provides programmatic access to merchant intelligence, product scanning, 
                  risk classification, and routing decisions. This API is designed for fintechs, PSPs, and 
                  payment platforms that need to make context-aware decisions about merchant onboarding, 
                  transaction routing, and compliance monitoring.
                </p>
                <p>
                  Every endpoint returns structured JSON and follows RESTful conventions. Authentication 
                  uses API keys, and all communication happens over HTTPS.
                </p>
              </div>

              <Callout type="info" title="Base URL">
                <code className="text-base">https://api.revelius.com/v1</code>
              </Callout>
            </section>

            {/* Authentication */}
            <section id="authentication" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                Authentication
              </h2>
              <p className="text-gray-700 mb-6">
                All API requests require authentication using an API key. Include your API key in the{' '}
                <InlineCode>Authorization</InlineCode> header as a Bearer token.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Headers</h3>
              <CodeBlock language="bash">
{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
              </CodeBlock>

              <Callout type="warning" title="Security Note">
                Never expose your API key in client-side code or public repositories. All requests 
                should be made from your server. Treat API keys like passwords.
              </Callout>
            </section>

            {/* Quick Start */}
            <section id="quickstart" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                Quick Start
              </h2>
              <p className="text-gray-700 mb-6">
                Get started with a simple merchant scan in under 5 minutes.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Get your API key</h3>
                  <p className="text-gray-700 mb-4">
                    Sign in to your Revelius dashboard and generate an API key from the settings page.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Make your first request</h3>
                  <p className="text-gray-700 mb-4">
                    Initiate a merchant scan using curl:
                  </p>
                  <CodeBlock language="bash">
{`curl -X POST https://api.revelius.com/v1/scan/initiate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchant_id": "mer_abc123",
    "url": "https://example-merchant.com",
    "scan_depth": "standard"
  }'`}
                  </CodeBlock>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Check scan results</h3>
                  <p className="text-gray-700 mb-4">
                    Poll for scan completion:
                  </p>
                  <CodeBlock language="bash">
{`curl https://api.revelius.com/v1/scan/scn_xyz789 \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                  </CodeBlock>
                </div>
              </div>
            </section>

            {/* Scanner API */}
            <section id="scanner-api" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Scanner API</h2>
              <p className="text-gray-700 mb-6">
                The Scanner API analyzes merchant websites, apps, and digital properties to understand 
                business context, product offerings, and risk signals.
              </p>

              <Endpoint method="POST" path="/scan/initiate">
                <p className="text-gray-700 mb-4">Initiate a scan of a merchant's digital presence.</p>
                
                <h4 className="font-semibold text-gray-900 mb-3">Request Body</h4>
                <CodeBlock>
{`{
  "merchant_id": "mer_abc123",
  "url": "https://example-merchant.com",
  "scan_depth": "standard",
  "include_products": true,
  "include_content": true
}`}
                </CodeBlock>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Field</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Type</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 font-mono text-gray-900">merchant_id</td>
                        <td className="px-4 py-3 text-gray-600">string</td>
                        <td className="px-4 py-3 text-gray-600">Your internal merchant identifier</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-gray-900">url</td>
                        <td className="px-4 py-3 text-gray-600">string</td>
                        <td className="px-4 py-3 text-gray-600">Merchant website URL</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-gray-900">scan_depth</td>
                        <td className="px-4 py-3 text-gray-600">string</td>
                        <td className="px-4 py-3 text-gray-600">standard, deep, or quick</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Response</h4>
                <CodeBlock>
{`{
  "scan_id": "scn_xyz789",
  "status": "processing",
  "merchant_id": "mer_abc123",
  "estimated_completion": "2024-01-15T10:30:00Z"
}`}
                </CodeBlock>
              </Endpoint>

              <Endpoint method="GET" path="/scan/:scan_id">
                <p className="text-gray-700 mb-4">Retrieve scan results and merchant intelligence.</p>
                
                <h4 className="font-semibold text-gray-900 mb-3">Response</h4>
                <CodeBlock>
{`{
  "scan_id": "scn_xyz789",
  "status": "completed",
  "merchant_id": "mer_abc123",
  "completed_at": "2024-01-15T10:28:34Z",
  "results": {
    "business_category": "electronics_retail",
    "risk_score": 42,
    "content_flags": [],
    "product_count": 847,
    "mcc_recommendations": ["5732", "5734"],
    "signals": {
      "has_physical_products": true,
      "has_digital_goods": false,
      "requires_age_verification": false,
      "restricted_categories": []
    }
  }
}`}
                </CodeBlock>
              </Endpoint>
            </section>

            {/* Routing API */}
            <section id="routing-api" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Routing API</h2>
              <p className="text-gray-700 mb-6">
                Evaluate product-level routing decisions and PSP eligibility based on Revelius intelligence.
              </p>

              <Endpoint method="POST" path="/routing/evaluate">
                <p className="text-gray-700 mb-4">
                  Evaluate routing options for a transaction based on cart contents and merchant profile.
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-3">Request Body</h4>
                <CodeBlock>
{`{
  "merchant_id": "mer_abc123",
  "transaction": {
    "amount": 15999,
    "currency": "USD",
    "items": [
      {
        "product_id": "prd_001",
        "quantity": 1,
        "price": 15999
      }
    ]
  },
  "available_psps": ["stripe", "adyen", "checkout"]
}`}
                </CodeBlock>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Response</h4>
                <CodeBlock>
{`{
  "recommendations": [
    {
      "psp": "stripe",
      "eligibility": "approved",
      "confidence": 0.95,
      "estimated_approval_rate": 0.87,
      "reasoning": [
        "merchant_category_match",
        "no_restricted_products",
        "historical_performance_good"
      ]
    }
  ],
  "primary_recommendation": "stripe"
}`}
                </CodeBlock>
              </Endpoint>
            </section>

            {/* Merchants API */}
            <section id="merchants-api" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Merchants API</h2>
              <p className="text-gray-700 mb-6">
                Manage merchant profiles, retrieve historical data, and configure monitoring.
              </p>

              <Endpoint method="GET" path="/merchants/:merchant_id">
                <p className="text-gray-700 mb-4">Retrieve merchant profile and latest intelligence.</p>
                
                <h4 className="font-semibold text-gray-900 mb-3">Response</h4>
                <CodeBlock>
{`{
  "merchant_id": "mer_abc123",
  "business_name": "Example Electronics",
  "url": "https://example-merchant.com",
  "status": "active",
  "risk_score": 42,
  "last_scanned": "2024-01-15T10:28:34Z",
  "categories": ["electronics_retail"]
}`}
                </CodeBlock>
              </Endpoint>
            </section>

            {/* Auth API */}
            <section id="auth-api" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Authentication API</h2>
              <p className="text-gray-700 mb-6">
                Manage API keys and access tokens programmatically.
              </p>

              <Endpoint method="POST" path="/auth/keys">
                <p className="text-gray-700 mb-4">Generate a new API key for your organization.</p>
                
                <h4 className="font-semibold text-gray-900 mb-3">Request Body</h4>
                <CodeBlock>
{`{
  "name": "Production API Key",
  "scopes": ["scan:read", "scan:write", "routing:read"],
  "expires_at": "2025-01-15T00:00:00Z"
}`}
                </CodeBlock>

                <Callout type="danger" title="Important">
                  API keys are only shown once upon creation. Store them securely.
                </Callout>
              </Endpoint>
            </section>

            {/* Integration Flow */}
            <section id="typical-flow" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Integration Flow</h2>
              <p className="text-gray-700 mb-6">
                A standard integration follows this sequence:
              </p>

              <div className="space-y-4">
                {[
                  {
                    step: '1',
                    title: 'Onboarding',
                    description: 'When a new merchant signs up, initiate a scan of their website using POST /scan/initiate.'
                  },
                  {
                    step: '2',
                    title: 'Intelligence Gathering',
                    description: 'Poll GET /scan/:scan_id or wait for webhook notification when scan completes.'
                  },
                  {
                    step: '3',
                    title: 'Risk Assessment',
                    description: 'Review the merchant profile and risk score from GET /merchants/:merchant_id.'
                  },
                  {
                    step: '4',
                    title: 'Routing Setup',
                    description: 'Configure routing rules based on product classifications and PSP eligibility.'
                  },
                  {
                    step: '5',
                    title: 'Ongoing Monitoring',
                    description: 'Enable continuous monitoring to detect business changes and category drift.'
                  },
                  {
                    step: '6',
                    title: 'Transaction Routing',
                    description: 'At transaction time, call POST /routing/evaluate with cart contents for real-time recommendations.'
                  }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Webhooks */}
            <section id="webhooks" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Webhooks</h2>
              <p className="text-gray-700 mb-6">
                Revelius can send webhook notifications when scans complete or risk signals are detected.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Webhook Events</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <code className="font-mono text-sm text-gray-900">scan.completed</code>
                    <span className="text-xs text-gray-500">Scan finished successfully</span>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <code className="font-mono text-sm text-gray-900">merchant.risk_change</code>
                    <span className="text-xs text-gray-500">Risk score changed significantly</span>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <code className="font-mono text-sm text-gray-900">product.restricted</code>
                    <span className="text-xs text-gray-500">Restricted product detected</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section id="best-practices" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Best Practices</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Rate Limiting</h3>
                  <p className="text-gray-700">
                    API requests are rate limited to 100 requests per minute per API key. Implement 
                    exponential backoff for retries when you receive a 429 status code.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Error Handling</h3>
                  <p className="text-gray-700 mb-4">
                    Always check response status codes and handle errors gracefully:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><code className="font-mono">400</code> - Invalid request parameters</li>
                    <li><code className="font-mono">401</code> - Invalid or missing API key</li>
                    <li><code className="font-mono">404</code> - Resource not found</li>
                    <li><code className="font-mono">429</code> - Rate limit exceeded</li>
                    <li><code className="font-mono">500</code> - Internal server error</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Idempotency</h3>
                  <p className="text-gray-700">
                    Use unique merchant_id values to ensure scan requests are idempotent. Multiple 
                    scans of the same merchant will update the existing profile rather than creating duplicates.
                  </p>
                </div>
              </div>
            </section>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-8 mt-12 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Previous</p>
                <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Home
                </Link>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Next</p>
                <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2">
                  Request Access
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to integrate?</h2>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Get started with the Revelius API and turn business context into better payment outcomes.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <GlossyButton to="/contact" variant="dark">
                  Request access
                </GlossyButton>
                <GlossyButton href={`${DASHBOARD_URL}/auth`} variant="outline-dark">
                  Sign in
                </GlossyButton>
              </div>
            </div>
          </div>
        </main>

        {/* Right sidebar - Table of Contents */}
        <aside className="hidden xl:block w-64 h-screen sticky top-0 overflow-y-auto border-l border-gray-200 bg-white">
          <div className="p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">On this page</h3>
            <nav className="space-y-2">
              {tableOfContents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`
                    block w-full text-left text-sm py-1 px-2 rounded transition-colors
                    ${activeSection === item.id
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
