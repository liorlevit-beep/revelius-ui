# Revelius API Layer

Production-grade SDK/API layer for the Revelius platform.

## Architecture

```
src/
├── config/
│   └── env.ts              # Environment configuration with validation
├── api/
│   ├── signer.ts           # SHA256 signature generation
│   ├── http.ts             # Centralized HTTP client
│   ├── scanner.ts          # Scanner API domain module
│   ├── products.ts         # Products API domain module
│   ├── operations.ts       # Operations API domain module
│   └── index.ts            # Public exports
├── types/
│   ├── common.ts           # Shared types
│   ├── scanner.ts          # Scanner types
│   └── products.ts         # Products types
└── mocks/
    ├── scanner.ts          # Scanner mock data
    └── products.ts         # Products mock data
```

## Authentication

All API requests use signed header authentication:

1. **Access-Key**: Your API access key
2. **Timestamp**: Unix timestamp in seconds
3. **Signature**: SHA256 hash of base64-encoded sorted headers + secret key
4. **Session-Id** (optional): For session-scoped endpoints

### Signing Algorithm

```typescript
// 1. Build headers
headers = { "Access-Key": accessKey, "Timestamp": timestamp }
if (sessionId) headers["Session-Id"] = sessionId

// 2. Sort and format
sorted = entries(headers)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
  .join('&')

// 3. Base64 encode with secret
base64String = btoa(sorted + secretKey)

// 4. Generate signature
signature = SHA256(base64String).toString()

// 5. Return signed headers
return { ...headers, "Signature": signature }
```

## Configuration

Set environment variables in `.env`:

```bash
# Required
VITE_REVELIUS_API_BASE_URL=https://api.revelius.com
VITE_REVELIUS_ACCESS_KEY=your_access_key
VITE_REVELIUS_SECRET_KEY=your_secret_key

# Optional (0 = live API, 1 = mock data)
VITE_REVELIUS_MOCK=0
```

## Usage

### Scanner API

```typescript
import { ScannerAPI } from '../api';

// Get categories
const categories = await ScannerAPI.getCategories();

// Scan a website
const scan = await ScannerAPI.scanWebsite('https://example.com');
const sessionId = scan.data.session_id;

// Check status
const status = await ScannerAPI.getSessionStatus(sessionId);

// Get report
const report = await ScannerAPI.getJsonReport(sessionId);

// Download PDF
const pdfBlob = await ScannerAPI.getPdfReport(sessionId);
```

### Products API

```typescript
import { ProductsAPI } from '../api';

// Get categories
const categories = await ProductsAPI.getCategories();

// Get routing table
const table = await ProductsAPI.getRoutingTable();

// Update routing table
const updated = await ProductsAPI.upsertRoutingTable({
  default_psp: 'stripe',
  mapping: { adyen: ['cat1', 'cat2'] }
});

// Route products
const routed = await ProductsAPI.routeProducts(sessionId, ['product1', 'product2']);
```

### Operations API

```typescript
import { OperationsAPI } from '../api';

// Create promo customer
const customer = await OperationsAPI.createPromoCustomer('John Doe', 'john@example.com');

// Send webhook
const result = await OperationsAPI.webhookHandler('webhook_123', { event: 'test' });
```

## Error Handling

```typescript
import { ApiError } from '../api';

try {
  const result = await ScannerAPI.scanWebsite(url);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error: ${error.message}`);
    console.error(`Status: ${error.status}`);
    console.error(`Details:`, error.details);
  }
}
```

## Mock Mode

Enable mock mode to test without hitting the live API:

```bash
VITE_REVELIUS_MOCK=1
```

All API calls will return predefined mock data. Perfect for:
- Development without API credentials
- Testing UI components
- Demos and presentations

## API Playground

Visit `/api-playground` to test all endpoints interactively:
- Scanner operations (scan, status, reports)
- Product routing and categories
- Promotional operations
- Webhook handling

## Endpoints

### Scanner
- `GET /scanner/categories` - List all scanner categories
- `POST /scanner/scan` - Scan a website (returns session_id)
- `GET /scanner/session/status` - Check scan status (requires Session-Id)
- `GET /scanner/report/json` - Get JSON report (requires Session-Id)
- `GET /scanner/report/pdf` - Download PDF report (requires Session-Id)

### Products
- `GET /products/categories` - List product categories
- `GET /products/routing_table` - Get routing configuration
- `POST /products/routing_table` - Update routing configuration
- `POST /products/router` - Route products (requires Session-Id)

### Operations
- `POST /operations/create_promo` - Create promotional customer
- `POST /operations/webhook_handler` - Handle webhook (requires Internal-Identifier header)

## Features

✅ **Production-ready**: Proper error handling, timeouts, type safety  
✅ **Signed authentication**: SHA256-based request signing  
✅ **Mock mode**: Test without API access  
✅ **Type-safe**: Full TypeScript support  
✅ **Modular**: Domain-based API organization  
✅ **Centralized**: Single HTTP client with consistent behavior  
✅ **Validated**: Runtime environment validation  
✅ **Tested**: Interactive API Playground for testing
