// Demo data for Developers area

export interface Project {
  id: string;
  name: string;
  description: string;
  environment: 'sandbox' | 'production';
  createdAt: Date;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  secret?: string; // Only shown once
  permissions: string[];
  environment: 'sandbox' | 'production';
  createdAt: Date;
  lastUsed?: Date;
  status: 'active' | 'revoked';
}

export interface Webhook {
  id: string;
  endpointUrl: string;
  signingSecret: string;
  subscribedEvents: string[];
  enabled: boolean;
  environment: 'sandbox' | 'production';
}

export interface WebhookDelivery {
  id: string;
  event: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
  statusCode: number;
  latency: number;
  environment: 'sandbox' | 'production';
  payload: any;
  response?: any;
}

export interface ApiExplorerExample {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    defaultValue?: string;
  }>;
  requestBody?: string;
  mockResponse: any;
}

export interface RequestLog {
  id: string;
  timestamp: Date;
  method: string;
  endpoint: string;
  status: number;
  latency: number;
  requestId: string;
  environment: 'sandbox' | 'production';
  headers?: any;
  body?: any;
  response?: any;
}

export interface SdkSnippet {
  id: string;
  language: string;
  title: string;
  code: string;
}

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Revelius Demo Project',
    description: 'Main demo project for Revelius platform',
    environment: 'production',
    createdAt: new Date('2024-06-15'),
  },
];

export const apiKeysSandbox: ApiKey[] = [
  {
    id: 'key-sb-1',
    name: 'Development Key',
    prefix: 'rk_test_4eC39',
    permissions: ['read:merchants', 'write:scans', 'read:reports'],
    environment: 'sandbox',
    createdAt: new Date('2024-12-01'),
    lastUsed: new Date('2025-01-07T10:30:00'),
    status: 'active',
  },
  {
    id: 'key-sb-2',
    name: 'Testing Key',
    prefix: 'rk_test_7hF21',
    permissions: ['read:merchants', 'read:reports', 'read:routing'],
    environment: 'sandbox',
    createdAt: new Date('2024-11-15'),
    lastUsed: new Date('2025-01-06T14:22:00'),
    status: 'active',
  },
];

export const apiKeysProduction: ApiKey[] = [
  {
    id: 'key-prod-1',
    name: 'Production API Key',
    prefix: 'rk_live_8kL94',
    permissions: ['read:merchants', 'write:scans', 'read:reports', 'write:routing'],
    environment: 'production',
    createdAt: new Date('2024-08-20'),
    lastUsed: new Date('2025-01-07T11:45:00'),
    status: 'active',
  },
];

export const webhooksSandbox: Webhook = {
  id: 'wh-sb-1',
  endpointUrl: 'https://api.yourdomain.com/webhooks/revelius-sandbox',
  signingSecret: 'whsec_test_5f7c3d9e2a1b8c4f6e9d0a2b3c4d5e6f7g8h9i0j',
  subscribedEvents: [
    'scan.completed',
    'scan.failed',
    'routing.decision_made',
    'merchant.updated',
  ],
  enabled: true,
  environment: 'sandbox',
};

export const webhooksProduction: Webhook = {
  id: 'wh-prod-1',
  endpointUrl: 'https://api.yourdomain.com/webhooks/revelius',
  signingSecret: 'whsec_live_9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t',
  subscribedEvents: [
    'scan.completed',
    'scan.failed',
    'routing.decision_made',
    'merchant.updated',
    'provider.status_changed',
  ],
  enabled: true,
  environment: 'production',
};

export const webhookDeliveries: WebhookDelivery[] = [
  {
    id: 'del-1',
    event: 'scan.completed',
    timestamp: new Date('2025-01-07T11:45:23'),
    status: 'success',
    statusCode: 200,
    latency: 142,
    environment: 'production',
    payload: {
      event: 'scan.completed',
      scan_id: 'scan_9k2j4h5g6f',
      merchant_id: 'merch-1',
      risk_score: 68,
      timestamp: '2025-01-07T11:45:20Z',
    },
    response: { received: true },
  },
  {
    id: 'del-2',
    event: 'routing.decision_made',
    timestamp: new Date('2025-01-07T10:32:15'),
    status: 'success',
    statusCode: 200,
    latency: 98,
    environment: 'production',
    payload: {
      event: 'routing.decision_made',
      transaction_id: 'txn-abc123',
      merchant_id: 'merch-2',
      selected_route: 'PSP A',
      approval_probability: 0.872,
      timestamp: '2025-01-07T10:32:14Z',
    },
    response: { received: true },
  },
  {
    id: 'del-3',
    event: 'scan.failed',
    timestamp: new Date('2025-01-07T09:15:42'),
    status: 'failed',
    statusCode: 500,
    latency: 5042,
    environment: 'sandbox',
    payload: {
      event: 'scan.failed',
      scan_id: 'scan_test123',
      error: 'Timeout waiting for response',
      timestamp: '2025-01-07T09:15:37Z',
    },
    response: { error: 'Internal Server Error' },
  },
];

export const apiExplorerExamples: ApiExplorerExample[] = [
  {
    id: 'ex-1',
    name: 'Scan URL',
    method: 'POST',
    endpoint: '/v1/scans',
    description: 'Trigger a new merchant website scan',
    parameters: [
      { name: 'url', type: 'string', required: true, description: 'Website URL to scan', defaultValue: 'https://example.com' },
      { name: 'merchant_id', type: 'string', required: false, description: 'Merchant ID (optional)' },
      { name: 'crawl_depth', type: 'number', required: false, description: 'Crawl depth (1-3)', defaultValue: '2' },
    ],
    requestBody: '{\n  "url": "https://example.com",\n  "crawl_depth": 2\n}',
    mockResponse: {
      scan_id: 'scan_9k2j4h5g6f',
      status: 'processing',
      url: 'https://example.com',
      estimated_completion: '2025-01-07T12:05:00Z',
      webhook_url: 'https://api.yourdomain.com/webhooks/revelius',
    },
  },
  {
    id: 'ex-2',
    name: 'Get Latest Report',
    method: 'GET',
    endpoint: '/v1/merchants/:merchant_id/reports/latest',
    description: 'Retrieve the latest scan report for a merchant',
    parameters: [
      { name: 'merchant_id', type: 'string', required: true, description: 'Merchant ID', defaultValue: 'merch-1' },
    ],
    mockResponse: {
      report_id: 'rpt_abc123',
      merchant_id: 'merch-1',
      scan_id: 'scan_xyz789',
      timestamp: '2025-01-07T11:45:20Z',
      risk_score: 68,
      categories_detected: ['Adult', 'Supplements'],
      findings_count: 12,
      top_findings: [
        { severity: 'high', title: 'Adult content detected', confidence: 0.92 },
        { severity: 'medium', title: 'Age verification missing', confidence: 0.85 },
      ],
    },
  },
  {
    id: 'ex-3',
    name: 'Get Routing Decision',
    method: 'POST',
    endpoint: '/v1/routing/decide',
    description: 'Get optimal payment routing for a transaction',
    parameters: [
      { name: 'merchant_id', type: 'string', required: true, description: 'Merchant ID', defaultValue: 'merch-1' },
      { name: 'amount', type: 'number', required: true, description: 'Transaction amount', defaultValue: '99.99' },
      { name: 'currency', type: 'string', required: true, description: 'Currency code', defaultValue: 'USD' },
      { name: 'country', type: 'string', required: true, description: 'Country code', defaultValue: 'US' },
    ],
    requestBody: '{\n  "merchant_id": "merch-1",\n  "amount": 99.99,\n  "currency": "USD",\n  "country": "US"\n}',
    mockResponse: {
      recommended_route: 'PSP A',
      approval_probability: 0.872,
      alternatives: [
        { route: 'PSP B', approval_probability: 0.846, cost_bps: 310 },
        { route: 'Local Acquirer', approval_probability: 0.913, cost_bps: 425 },
      ],
      reasons: ['Optimal approval rate for merchant category', 'Lower processing cost', 'Compliant with regional requirements'],
    },
  },
  {
    id: 'ex-4',
    name: 'List Merchants',
    method: 'GET',
    endpoint: '/v1/merchants',
    description: 'List all merchants',
    parameters: [
      { name: 'limit', type: 'number', required: false, description: 'Results per page', defaultValue: '20' },
      { name: 'offset', type: 'number', required: false, description: 'Pagination offset', defaultValue: '0' },
    ],
    mockResponse: {
      merchants: [
        { id: 'merch-1', name: 'StreamPro', domain: 'streampro.com', risk_score: 42, status: 'active' },
        { id: 'merch-2', name: 'BetWin Casino', domain: 'betwin.com', risk_score: 68, status: 'review' },
      ],
      total: 412,
      limit: 20,
      offset: 0,
    },
  },
  {
    id: 'ex-5',
    name: 'List Providers',
    method: 'GET',
    endpoint: '/v1/providers',
    description: 'List all connected payment providers',
    parameters: [],
    mockResponse: {
      providers: [
        { id: 'psp-a', name: 'PSP A', status: 'connected', approval_rate: 87.2, volume_share: 42.3 },
        { id: 'psp-b', name: 'PSP B', status: 'connected', approval_rate: 84.6, volume_share: 28.7 },
      ],
      total: 4,
    },
  },
];

export const requestLogs: RequestLog[] = [
  {
    id: 'req-1',
    timestamp: new Date('2025-01-07T11:45:23'),
    method: 'POST',
    endpoint: '/v1/scans',
    status: 201,
    latency: 234,
    requestId: 'req_9k2j4h5g6f',
    environment: 'production',
    headers: { 'content-type': 'application/json', 'authorization': 'Bearer rk_live_***' },
    body: { url: 'https://betwin.com', crawl_depth: 2 },
    response: { scan_id: 'scan_9k2j4h5g6f', status: 'processing' },
  },
  {
    id: 'req-2',
    timestamp: new Date('2025-01-07T11:32:15'),
    method: 'GET',
    endpoint: '/v1/merchants/merch-1/reports/latest',
    status: 200,
    latency: 89,
    requestId: 'req_8h3j2k1l0m',
    environment: 'production',
    headers: { 'authorization': 'Bearer rk_live_***' },
    response: { report_id: 'rpt_abc123', risk_score: 68 },
  },
  {
    id: 'req-3',
    timestamp: new Date('2025-01-07T10:15:42'),
    method: 'POST',
    endpoint: '/v1/routing/decide',
    status: 200,
    latency: 142,
    requestId: 'req_7g2h1i0j9k',
    environment: 'production',
    headers: { 'content-type': 'application/json', 'authorization': 'Bearer rk_live_***' },
    body: { merchant_id: 'merch-2', amount: 149.99, currency: 'USD', country: 'US' },
    response: { recommended_route: 'Local Acquirer', approval_probability: 0.913 },
  },
  {
    id: 'req-4',
    timestamp: new Date('2025-01-07T09:42:18'),
    method: 'GET',
    endpoint: '/v1/merchants',
    status: 200,
    latency: 67,
    requestId: 'req_6f1g0h9i8j',
    environment: 'sandbox',
    headers: { 'authorization': 'Bearer rk_test_***' },
    response: { merchants: [], total: 0 },
  },
];

export const sdkSnippets: SdkSnippet[] = [
  {
    id: 'sdk-1',
    language: 'javascript',
    title: 'Node.js SDK',
    code: `import Revelius from '@revelius/node';

const revelius = new Revelius({
  apiKey: 'rk_live_...',
});

// Trigger a scan
const scan = await revelius.scans.create({
  url: 'https://example.com',
  crawlDepth: 2,
});

// Get routing decision
const routing = await revelius.routing.decide({
  merchantId: 'merch-1',
  amount: 99.99,
  currency: 'USD',
  country: 'US',
});`,
  },
  {
    id: 'sdk-2',
    language: 'python',
    title: 'Python SDK',
    code: `import revelius

revelius.api_key = "rk_live_..."

# Trigger a scan
scan = revelius.Scan.create(
    url="https://example.com",
    crawl_depth=2
)

# Get routing decision
routing = revelius.Routing.decide(
    merchant_id="merch-1",
    amount=99.99,
    currency="USD",
    country="US"
)`,
  },
  {
    id: 'sdk-3',
    language: 'javascript',
    title: 'Webhook Signature Verification',
    code: `const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(hmac)
  );
}

// In your webhook handler
app.post('/webhooks/revelius', (req, res) => {
  const signature = req.headers['x-revelius-signature'];
  const isValid = verifyWebhookSignature(
    req.body,
    signature,
    process.env.REVELIUS_WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook event
  console.log('Event:', req.body.event);
  res.json({ received: true });
});`,
  },
  {
    id: 'sdk-4',
    language: 'javascript',
    title: 'Integration with Stripe',
    code: `// Revelius + Stripe integration example
const stripe = require('stripe')(process.env.STRIPE_KEY);
const revelius = require('@revelius/node')(process.env.REVELIUS_KEY);

async function processPayment(paymentIntent) {
  // Get routing decision from Revelius
  const decision = await revelius.routing.decide({
    merchantId: paymentIntent.metadata.merchantId,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    country: paymentIntent.shipping.address.country,
  });
  
  // Route based on Revelius recommendation
  const provider = decision.recommended_route;
  console.log(\`Routing to \${provider} (approval prob: \${decision.approval_probability})\`);
  
  // Confirm payment
  return await stripe.paymentIntents.confirm(paymentIntent.id);
}`,
  },
];

export const availableEvents = [
  'scan.completed',
  'scan.failed',
  'scan.started',
  'routing.decision_made',
  'merchant.created',
  'merchant.updated',
  'merchant.deleted',
  'provider.status_changed',
  'provider.connected',
  'provider.disconnected',
  'policy.triggered',
  'transaction.processed',
];


