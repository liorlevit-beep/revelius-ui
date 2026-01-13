# Revelius SDK Integration Guide

This guide shows how to integrate the Revelius SDK with existing pages in the application.

## Overview

The SDK is already implemented and available at `src/lib/revelius-sdk`. It includes:

- **Authentication**: Automatic request signing with SHA256
- **Type Safety**: Full TypeScript definitions
- **Error Handling**: Consistent error responses
- **Logging**: Console debugging for development

## Available Endpoints

### Scanner API (5 endpoints)
- `getScannerCategories()` - Get all scanner categories
- `scanWebsite(request)` - Initiate a website scan
- `getSessionStatus(sessionId)` - Check scan status
- `getPdfReport(sessionId)` - Download PDF report
- `getJsonReport(sessionId)` - Get JSON report

### Operations API (2 endpoints)
- `createPromoCustomer(request)` - Create promo customer
- `webhookHandler(request)` - Handle webhooks

### Products API (4 endpoints)
- `getProductCategories()` - Get product categories
- `getRoutingTable()` - Get routing configuration
- `updateRoutingTable(table)` - Update routing config
- `routeProducts(request, sessionId?)` - Route products to PSPs

## Integration Examples

### 1. Initialize the SDK

```typescript
import { ReveliusClient } from '../lib/revelius-sdk';

// Get credentials from localStorage
const stored = localStorage.getItem('revelius_api_keys');
const { accessKey, secretKey } = JSON.parse(stored);

// Create client
const client = new ReveliusClient({ accessKey, secretKey });
```

### 2. Scan a Website (Scanner Page)

```typescript
// src/pages/Scans.tsx
import { ReveliusClient } from '../lib/revelius-sdk';

function ScansPage() {
  const [sdk, setSdk] = useState<ReveliusClient | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleScanWebsite = async (url: string) => {
    if (!sdk) return;
    
    setScanning(true);
    const response = await sdk.scanWebsite({ url });
    
    if (response.success) {
      const sessionId = response.data.session_id;
      // Poll for status
      pollScanStatus(sessionId);
    } else {
      alert(`Scan failed: ${response.error}`);
    }
    
    setScanning(false);
  };

  const pollScanStatus = async (sessionId: string) => {
    const interval = setInterval(async () => {
      const response = await sdk.getSessionStatus(sessionId);
      
      if (response.success && response.data.status === 'completed') {
        clearInterval(interval);
        // Get the report
        const report = await sdk.getJsonReport(sessionId);
        console.log('Scan complete:', report.data);
      }
    }, 3000); // Check every 3 seconds
  };

  return (
    <div>
      <button onClick={() => handleScanWebsite('https://example.com')}>
        Scan Website
      </button>
    </div>
  );
}
```

### 3. Route Products (Transactions Page)

```typescript
// src/pages/Transactions.tsx
import { ReveliusClient } from '../lib/revelius-sdk';

function TransactionsPage() {
  const [sdk] = useState<ReveliusClient>(() => {
    const stored = localStorage.getItem('revelius_api_keys');
    const { accessKey, secretKey } = JSON.parse(stored);
    return new ReveliusClient({ accessKey, secretKey });
  });

  const handleRouteProducts = async (products: string[]) => {
    const response = await sdk.routeProducts({ products });
    
    if (response.success) {
      console.log('Routing decisions:', response.data.routes);
      // Update UI with routing recommendations
    }
  };

  return <div>...</div>;
}
```

### 4. Manage Routing Table (Providers Page)

```typescript
// src/pages/Providers.tsx
import { ReveliusClient } from '../lib/revelius-sdk';

function ProvidersPage() {
  const [routingTable, setRoutingTable] = useState(null);

  const loadRoutingTable = async () => {
    const response = await sdk.getRoutingTable();
    if (response.success) {
      setRoutingTable(response.data);
    }
  };

  const saveRoutingTable = async (table) => {
    const response = await sdk.updateRoutingTable(table);
    if (response.success) {
      alert('Routing table updated!');
    }
  };

  useEffect(() => {
    loadRoutingTable();
  }, []);

  return <div>...</div>;
}
```

### 5. Create Promo Customer (Operations)

```typescript
// src/pages/Developers.tsx or similar
const handleCreatePromo = async () => {
  const response = await sdk.createPromoCustomer({
    name: 'Demo Customer',
    email: 'demo@example.com'
  });

  if (response.success) {
    console.log('Customer created:', response.data.customer_id);
  }
};
```

## Error Handling Best Practices

```typescript
const response = await sdk.scanWebsite({ url: 'https://example.com' });

if (response.success) {
  // Success path
  console.log('Session ID:', response.data.session_id);
} else {
  // Error path
  console.error('Error:', response.error);
  
  // Show user-friendly error
  if (response.error.includes('CORS')) {
    alert('API access blocked. Please contact support.');
  } else if (response.error.includes('401')) {
    alert('Invalid credentials. Please check your API keys.');
  } else {
    alert(`Request failed: ${response.error}`);
  }
}
```

## CORS & Browser Limitations

**Important:** Direct browser-to-API calls may fail due to CORS restrictions:

- The API must explicitly allow requests from your origin (`http://localhost:5174`)
- For production, use a backend proxy to avoid CORS issues
- The SDK includes detailed console logging to debug CORS errors

### Option 1: Backend Proxy (Recommended)

Create a simple Express server:

```javascript
// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/api/proxy', async (req, res) => {
  const { endpoint, method, body } = req.body;
  
  // Forward request to Revelius API
  const response = await fetch(`https://api.revelius.com${endpoint}`, {
    method,
    headers: {
      // Include signed headers
    },
    body: body ? JSON.stringify(body) : undefined
  });
  
  const data = await response.json();
  res.json(data);
});

app.listen(3001);
```

### Option 2: Development CORS Bypass

For development only, you can use a browser extension to disable CORS, or configure Vite proxy:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.revelius.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

## Type Definitions

All request and response types are available in `src/lib/revelius-sdk/types.ts`:

```typescript
import type {
  ScanWebsiteRequest,
  ScanWebsiteResponse,
  SessionStatusResponse,
  ScanReport,
  CreatePromoRequest,
  RoutingTable,
  RouteProductsRequest,
} from '../lib/revelius-sdk/types';
```

## Testing

The SDK Demo page (`/sdk-demo`) provides a full interactive playground for testing all endpoints.

## Next Steps

1. ✅ SDK is implemented with all 11 endpoints
2. ✅ Authentication is working (SHA256 signature)
3. ✅ UI playground is available at `/sdk-demo`
4. 🔜 Integrate SDK calls into existing pages
5. 🔜 Replace mock data with real API responses
6. 🔜 Implement backend proxy for production

## Support

- Check browser console (F12) for detailed logs
- All SDK requests log: URL, headers, body, response
- Use the SDK Demo page to test endpoints
- Verify credentials are valid and stored in localStorage
