# Revelius SDK

Official TypeScript/JavaScript SDK for the Revelius API.

## Installation

```bash
# This SDK is embedded in the project
# No separate installation required
```

## Quick Start

```typescript
import { ReveliusClient } from './lib/revelius-sdk';

// Initialize the client
const client = new ReveliusClient({
  accessKey: 'your-access-key',
  secretKey: 'your-secret-key',
  baseUrl: 'https://api.revelius.com' // optional, defaults to production
});

// Example: Scan a website
const response = await client.scanWebsite({ url: 'https://example.com' });
if (response.success) {
  console.log('Scan initiated:', response.data.session_id);
}
```

## Authentication

The SDK uses a custom authentication mechanism that:

1. Creates a timestamp
2. Includes `Access-Key`, `Timestamp`, and optional `Session-Id` headers
3. Sorts headers alphabetically
4. URL-encodes values into a query string
5. Concatenates with the secret key
6. Base64 encodes the result
7. Hashes with SHA256 to create the `Signature` header

All of this is handled automatically by the SDK.

## API Reference

### Scanner API

#### Get Scanner Categories
```typescript
const response = await client.getScannerCategories();
```
Returns all available scanner categories.

#### Scan Website
```typescript
const response = await client.scanWebsite({ url: 'https://example.com' });
// Returns: { session_id: string, status: string }
```
Initiates a website scan. Returns a `session_id` for tracking progress.

#### Get Session Status
```typescript
const response = await client.getSessionStatus('session-id-here');
// Returns: { session_id: string, status: 'pending' | 'processing' | 'completed' | 'failed', progress?: number }
```
Check the status of a scan session.

#### Get PDF Report
```typescript
const response = await client.getPdfReport('session-id-here');
```
Download the scan report as a PDF. Requires a completed scan session.

#### Get JSON Report
```typescript
const response = await client.getJsonReport('session-id-here');
// Returns: { session_id, url, scan_date, findings, risk_score, categories }
```
Get the scan report as JSON. Requires a completed scan session.

### Operations API

#### Create Promo Customer
```typescript
const response = await client.createPromoCustomer({
  name: 'Demo Customer',
  email: 'demo@example.com'
});
// Returns: { customer_id, name, email, status }
```
Create a promotional customer account.

#### Webhook Handler
```typescript
const response = await client.webhookHandler({
  status: 'success',
  // ... additional webhook data
});
```
Send webhook data to Revelius. Note: This endpoint uses different authentication (Access-Key + Internal-Identifier).

### Products API

#### Get Product Categories
```typescript
const response = await client.getProductCategories();
```
Get all supported product categories.

#### Get Routing Table
```typescript
const response = await client.getRoutingTable();
// Returns: { default_psp: string, mapping: { [psp: string]: string[] } }
```
Get the current customer routing table configuration.

#### Update Routing Table
```typescript
const response = await client.updateRoutingTable({
  default_psp: 'rapyd',
  mapping: {
    stripe: ['68a18ad49d3b5972248ca507', '68a18ad49d3b5972248ca509'],
    adyen: ['68a18ad49d3b5972248ca50b', '68a18ad49d3b5972248ca50c']
  }
});
```
Create or update the routing table configuration.

#### Route Products
```typescript
const response = await client.routeProducts(
  { products: ['Product A', 'Product B', 'Product C'] },
  'optional-session-id'
);
// Returns: { routes: [{ product, psp, category }] }
```
Route products to appropriate PSPs based on routing table.

## Response Format

All API methods return a consistent response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;           // Present if success = true
  error?: string;     // Present if success = false
  message?: string;   // Optional additional info
}
```

## Error Handling

```typescript
const response = await client.scanWebsite({ url: 'https://example.com' });

if (response.success) {
  console.log('Success:', response.data);
} else {
  console.error('Error:', response.error);
}
```

## CORS Considerations

**Important:** Browser-based requests to the Revelius API require:
- The API server must allow CORS requests from your origin (e.g., `http://localhost:5174`)
- Proper CORS headers must be set on the API server
- For production use, consider using a backend proxy to avoid CORS issues

## Environment Variables

Store your credentials securely:

```typescript
// Don't hardcode credentials!
const client = new ReveliusClient({
  accessKey: import.meta.env.VITE_REVELIUS_ACCESS_KEY,
  secretKey: import.meta.env.VITE_REVELIUS_SECRET_KEY,
});
```

## Testing

Use the **SDK Demo** page in the application to test all endpoints interactively.

## Support

For issues or questions:
- Check the browser console (F12) for detailed request/response logs
- Verify your API credentials are valid
- Ensure the API allows CORS from your origin
- Contact Revelius support if the issue persists

## License

Proprietary - For use with Revelius services only.
