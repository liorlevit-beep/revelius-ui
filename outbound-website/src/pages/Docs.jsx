import { useState } from 'react';
import { Link } from 'react-router-dom';

function CollapsibleSection({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <span>{title}</span>
        <span className="text-gray-400">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}

function CodeBlock({ children, language = 'json' }) {
  return (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
      <code>{children}</code>
    </pre>
  );
}

export default function Docs() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">Documentation</h1>
        <p className="text-xl text-gray-600">
          Integrating with the Revelius Intelligence Layer
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h2>
        <nav className="space-y-2">
          <a href="#overview" className="block text-blue-600 hover:text-blue-700">1. Overview</a>
          <a href="#authentication" className="block text-blue-600 hover:text-blue-700">2. Authentication</a>
          <a href="#scanner-api" className="block text-blue-600 hover:text-blue-700">3. Scanner API</a>
          <a href="#products-routing" className="block text-blue-600 hover:text-blue-700">4. Products & Routing</a>
          <a href="#operations" className="block text-blue-600 hover:text-blue-700">5. Operations</a>
          <a href="#portal" className="block text-blue-600 hover:text-blue-700">6. Portal</a>
          <a href="#auth-api" className="block text-blue-600 hover:text-blue-700">7. Authentication API</a>
          <a href="#typical-flow" className="block text-blue-600 hover:text-blue-700">8. Typical Flow</a>
          <a href="#what-this-enables" className="block text-blue-600 hover:text-blue-700">9. What This Enables</a>
        </nav>
      </div>

      {/* 1. Overview */}
      <section id="overview" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Overview</h2>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
          <p>
            The Revelius API provides programmatic access to merchant intelligence, product scanning, 
            risk classification, and routing decisions.
          </p>
          <p>
            This API is designed for fintechs, PSPs, and payment platforms that need to make 
            context-aware decisions about merchant onboarding, transaction routing, and compliance monitoring.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
            <p className="font-semibold text-gray-900">Base URL</p>
            <code className="text-sm text-gray-700">https://api.revelius.com/v1</code>
          </div>
        </div>
      </section>

      {/* 2. Authentication */}
      <section id="authentication" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Authentication</h2>
        <div className="space-y-4 mb-6">
          <p className="text-gray-700">
            All API requests require authentication using an API key. Include your API key in the 
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">Authorization</code> header.
          </p>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Headers</h3>
        <CodeBlock>
{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
        </CodeBlock>

        <div className="bg-amber-50 border-l-4 border-amber-600 p-4 my-6">
          <p className="font-semibold text-gray-900 mb-2">Security Note</p>
          <p className="text-gray-700 text-sm">
            Never expose your API key in client-side code or public repositories. 
            All requests should be made from your server.
          </p>
        </div>
      </section>

      {/* 3. Scanner API */}
      <section id="scanner-api" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Scanner API</h2>
        <p className="text-gray-700 mb-6">
          The Scanner API analyzes merchant websites, apps, and digital properties to understand 
          business context, product offerings, and risk signals.
        </p>

        <CollapsibleSection title="POST /scan/initiate" defaultOpen={true}>
          <p className="text-gray-700 mb-4">Initiate a scan of a merchant's digital presence.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
          <CodeBlock>
{`{
  "merchant_id": "mer_abc123",
  "url": "https://example-merchant.com",
  "scan_depth": "standard",
  "include_products": true,
  "include_content": true
}`}
          </CodeBlock>

          <h4 className="font-semibold text-gray-900 mb-2 mt-6">Response</h4>
          <CodeBlock>
{`{
  "scan_id": "scn_xyz789",
  "status": "processing",
  "merchant_id": "mer_abc123",
  "estimated_completion": "2024-01-15T10:30:00Z",
  "webhook_url": "https://your-domain.com/webhooks/scan-complete"
}`}
          </CodeBlock>
        </CollapsibleSection>

        <CollapsibleSection title="GET /scan/:scan_id">
          <p className="text-gray-700 mb-4">Retrieve scan results and merchant intelligence.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
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
        </CollapsibleSection>

        <CollapsibleSection title="GET /scan/:scan_id/products">
          <p className="text-gray-700 mb-4">Retrieve detailed product information from a scan.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Query Parameters</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">limit</code> - Number of products to return (default: 100)</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">offset</code> - Pagination offset</li>
            <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">category</code> - Filter by product category</li>
          </ul>

          <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
          <CodeBlock>
{`{
  "products": [
    {
      "product_id": "prd_001",
      "title": "Wireless Bluetooth Headphones",
      "category": "electronics",
      "price": 79.99,
      "currency": "USD",
      "risk_signals": [],
      "restricted": false
    }
  ],
  "total": 847,
  "limit": 100,
  "offset": 0
}`}
          </CodeBlock>
        </CollapsibleSection>
      </section>

      {/* 4. Products & Routing */}
      <section id="products-routing" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Products & Routing</h2>
        <p className="text-gray-700 mb-6">
          Evaluate product-level routing decisions and PSP eligibility based on Revelius intelligence.
        </p>

        <CollapsibleSection title="POST /routing/evaluate" defaultOpen={true}>
          <p className="text-gray-700 mb-4">
            Evaluate routing options for a transaction based on cart contents and merchant profile.
          </p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
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

          <h4 className="font-semibold text-gray-900 mb-2 mt-6">Response</h4>
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
    },
    {
      "psp": "adyen",
      "eligibility": "approved",
      "confidence": 0.92,
      "estimated_approval_rate": 0.84
    },
    {
      "psp": "checkout",
      "eligibility": "review",
      "confidence": 0.78,
      "reasoning": [
        "merchant_category_uncertain"
      ]
    }
  ],
  "primary_recommendation": "stripe"
}`}
          </CodeBlock>
        </CollapsibleSection>

        <CollapsibleSection title="POST /products/classify">
          <p className="text-gray-700 mb-4">
            Classify individual products for risk assessment and routing decisions.
          </p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
          <CodeBlock>
{`{
  "products": [
    {
      "title": "CBD Oil 1000mg",
      "description": "Full spectrum hemp extract",
      "url": "https://example.com/products/cbd-oil"
    }
  ]
}`}
          </CodeBlock>

          <h4 className="font-semibold text-gray-900 mb-2 mt-6">Response</h4>
          <CodeBlock>
{`{
  "classifications": [
    {
      "title": "CBD Oil 1000mg",
      "category": "health_supplements",
      "risk_level": "high",
      "restricted_psps": ["stripe", "paypal"],
      "allowed_psps": ["checkout", "fiserv"],
      "signals": [
        "cbd_product",
        "health_claims_possible",
        "age_restriction_required"
      ]
    }
  ]
}`}
          </CodeBlock>
        </CollapsibleSection>
      </section>

      {/* 5. Operations */}
      <section id="operations" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Operations</h2>
        <p className="text-gray-700 mb-6">
          Monitor merchant activity, retrieve historical scans, and manage ongoing operations.
        </p>

        <CollapsibleSection title="GET /merchants/:merchant_id">
          <p className="text-gray-700 mb-4">Retrieve merchant profile and latest intelligence.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
          <CodeBlock>
{`{
  "merchant_id": "mer_abc123",
  "business_name": "Example Electronics",
  "url": "https://example-merchant.com",
  "status": "active",
  "risk_score": 42,
  "last_scanned": "2024-01-15T10:28:34Z",
  "categories": ["electronics_retail"],
  "signals": {
    "business_model": "direct_to_consumer",
    "product_types": ["physical_goods"],
    "restricted_categories": []
  }
}`}
          </CodeBlock>
        </CollapsibleSection>

        <CollapsibleSection title="GET /merchants/:merchant_id/scans">
          <p className="text-gray-700 mb-4">List all scans for a merchant.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
          <CodeBlock>
{`{
  "scans": [
    {
      "scan_id": "scn_xyz789",
      "status": "completed",
      "initiated_at": "2024-01-15T09:00:00Z",
      "completed_at": "2024-01-15T10:28:34Z",
      "risk_score": 42
    }
  ],
  "total": 1
}`}
          </CodeBlock>
        </CollapsibleSection>

        <CollapsibleSection title="POST /merchants/:merchant_id/monitor">
          <p className="text-gray-700 mb-4">
            Enable continuous monitoring for a merchant to detect changes in business activity.
          </p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
          <CodeBlock>
{`{
  "frequency": "daily",
  "alert_threshold": "medium",
  "webhook_url": "https://your-domain.com/webhooks/merchant-alerts"
}`}
          </CodeBlock>
        </CollapsibleSection>
      </section>

      {/* 6. Portal */}
      <section id="portal" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Portal</h2>
        <p className="text-gray-700 mb-6">
          The Revelius Portal provides a web interface for viewing merchant intelligence, 
          scan results, and routing recommendations. Access is available through your dashboard.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Portal Features</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>View merchant profiles and risk assessments</li>
            <li>Browse product catalogs and classifications</li>
            <li>Review routing recommendations and PSP eligibility</li>
            <li>Access scan history and evidence trails</li>
            <li>Configure monitoring rules and alerts</li>
          </ul>
        </div>

        <p className="text-gray-700 mt-4">
          Portal URL: <a href="https://portal.revelius.com" className="text-blue-600 hover:text-blue-700">https://portal.revelius.com</a>
        </p>
      </section>

      {/* 7. Authentication API */}
      <section id="auth-api" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Authentication API</h2>
        <p className="text-gray-700 mb-6">
          Manage API keys and access tokens programmatically.
        </p>

        <CollapsibleSection title="POST /auth/keys">
          <p className="text-gray-700 mb-4">Generate a new API key for your organization.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
          <CodeBlock>
{`{
  "name": "Production API Key",
  "scopes": ["scan:read", "scan:write", "routing:read"],
  "expires_at": "2025-01-15T00:00:00Z"
}`}
          </CodeBlock>

          <h4 className="font-semibold text-gray-900 mb-2 mt-6">Response</h4>
          <CodeBlock>
{`{
  "api_key": "rev_live_abc123...",
  "key_id": "key_xyz789",
  "name": "Production API Key",
  "created_at": "2024-01-15T10:00:00Z",
  "expires_at": "2025-01-15T00:00:00Z"
}`}
          </CodeBlock>

          <div className="bg-red-50 border-l-4 border-red-600 p-4 mt-4">
            <p className="font-semibold text-gray-900 mb-2">Important</p>
            <p className="text-gray-700 text-sm">
              API keys are only shown once upon creation. Store them securely.
            </p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="GET /auth/keys">
          <p className="text-gray-700 mb-4">List all API keys for your organization.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
          <CodeBlock>
{`{
  "keys": [
    {
      "key_id": "key_xyz789",
      "name": "Production API Key",
      "created_at": "2024-01-15T10:00:00Z",
      "last_used": "2024-01-16T08:30:00Z",
      "expires_at": "2025-01-15T00:00:00Z"
    }
  ]
}`}
          </CodeBlock>
        </CollapsibleSection>

        <CollapsibleSection title="DELETE /auth/keys/:key_id">
          <p className="text-gray-700 mb-4">Revoke an API key immediately.</p>
          
          <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
          <CodeBlock>
{`{
  "deleted": true,
  "key_id": "key_xyz789"
}`}
          </CodeBlock>
        </CollapsibleSection>
      </section>

      {/* 8. Typical Flow */}
      <section id="typical-flow" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Typical Flow</h2>
        <p className="text-gray-700 mb-6">
          A standard integration follows this sequence:
        </p>

        <div className="space-y-6">
          <div className="border-l-4 border-blue-600 pl-6">
            <h3 className="font-bold text-gray-900 mb-2">1. Onboarding</h3>
            <p className="text-gray-700">
              When a new merchant signs up, initiate a scan of their website using 
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">POST /scan/initiate</code>.
            </p>
          </div>

          <div className="border-l-4 border-blue-600 pl-6">
            <h3 className="font-bold text-gray-900 mb-2">2. Intelligence Gathering</h3>
            <p className="text-gray-700">
              Poll <code className="bg-gray-100 px-2 py-1 rounded text-sm">GET /scan/:scan_id</code> 
              or wait for webhook notification when scan completes.
            </p>
          </div>

          <div className="border-l-4 border-blue-600 pl-6">
            <h3 className="font-bold text-gray-900 mb-2">3. Risk Assessment</h3>
            <p className="text-gray-700">
              Review the merchant profile and risk score from 
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">GET /merchants/:merchant_id</code>.
            </p>
          </div>

          <div className="border-l-4 border-blue-600 pl-6">
            <h3 className="font-bold text-gray-900 mb-2">4. Routing Setup</h3>
            <p className="text-gray-700">
              Configure routing rules based on product classifications and PSP eligibility 
              from <code className="bg-gray-100 px-2 py-1 rounded text-sm">POST /routing/evaluate</code>.
            </p>
          </div>

          <div className="border-l-4 border-blue-600 pl-6">
            <h3 className="font-bold text-gray-900 mb-2">5. Ongoing Monitoring</h3>
            <p className="text-gray-700">
              Enable continuous monitoring with 
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">POST /merchants/:merchant_id/monitor</code> 
              to detect business changes.
            </p>
          </div>

          <div className="border-l-4 border-blue-600 pl-6">
            <h3 className="font-bold text-gray-900 mb-2">6. Transaction Routing</h3>
            <p className="text-gray-700">
              At transaction time, call 
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">POST /routing/evaluate</code> 
              with cart contents to get real-time routing recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* 9. What This Enables */}
      <section id="what-this-enables" className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">9. What This Enables</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smarter Onboarding</h3>
            <p className="text-gray-700">
              Automatically classify merchants, identify risk signals, and recommend appropriate 
              PSPs based on actual business activity instead of self-reported data.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Dynamic Routing</h3>
            <p className="text-gray-700">
              Route transactions to PSPs that are most likely to approve based on merchant 
              category, product mix, and historical performance data.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Continuous Compliance</h3>
            <p className="text-gray-700">
              Monitor merchants for business model changes, restricted products, or risk signals 
              that require review without manual audits.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Evidence-Based Decisions</h3>
            <p className="text-gray-700">
              Every classification and routing decision is backed by scan evidence, making 
              audits, disputes, and reviews straightforward.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to integrate?</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Get started with the Revelius API and turn business context into better payment outcomes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link 
            to="/request-access" 
            className="px-8 py-3.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Request access
          </Link>
          <Link 
            to="/signin" 
            className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>
    </div>
  );
}
