# Dynamic Routing Visual Implementation

## Overview
Updated the routing visualization canvas to dynamically render provider nodes based on the routing table, instead of using fixed hardcoded providers. The visual now adapts to any number of providers (3, 6, 30, etc.) with responsive grid layout.

## Changes Made

### 1. Dynamic Provider Configuration (`src/pages/Demo.tsx`)

**Replaced Hardcoded PSP_CONFIG:**
```typescript
// OLD: Fixed 5 providers
const PSP_CONFIG = {
  Stripe: { ... },
  Adyen: { ... },
  // etc
};

// NEW: Dynamic configuration
const DEFAULT_PSP_CONFIG: Record<string, { color: string; logo: string }> = {
  stripe: { color: '#635BFF', logo: '...' },
  adyen: { color: '#0ABF53', logo: '...' },
  // 10 default providers with logos
};

const PROVIDER_COLORS = [
  // 20 stable colors for unknown providers
];

function getProviderConfig(providerKey: string, index: number) {
  // Returns config with fallback for unknown providers
}
```

**Key Features:**
- Supports 10 pre-configured providers with brand colors and logos
- 20-color stable palette for additional providers
- Automatic logo generation via Clearbit for unknown providers
- Deterministic color assignment based on provider index

### 2. Routing Table Integration

**Added useRoutingTable Hook:**
```typescript
const { data: routingTable, providers: availableProviders } = useRoutingTable();

const pspConfig = useMemo(() => {
  const providers = availableProviders.length > 0 
    ? availableProviders 
    : ['stripe', 'adyen', 'fiserv', 'checkout', 'worldpay'];
  
  const config: Record<string, { color: string; logo: string }> = {};
  providers.forEach((provider, index) => {
    config[provider] = getProviderConfig(provider, index);
  });
  return config;
}, [availableProviders]);
```

### 3. Grid Layout (2 Columns, Max 6 Visible)

**Replaced Vertical Stack with Grid:**
```typescript
const MAX_VISIBLE_PROVIDERS = 6;
const visibleProviders = Object.keys(pspConfig).slice(0, MAX_VISIBLE_PROVIDERS);
const hiddenProviders = Object.keys(pspConfig).slice(MAX_VISIBLE_PROVIDERS);
const hasMoreProviders = hiddenProviders.length > 0;

// Layout calculation
const visiblePspCount = visibleProviders.length + (hasMoreProviders ? 1 : 0);
const pspRows = Math.ceil(visiblePspCount / 2);
const pspStackHeight = (pspHeight + pspGap) * pspRows - pspGap;
```

**UI Structure:**
```jsx
<div className="grid grid-cols-2 gap-3" style={{ width: `${220 * 2 + 12}px` }}>
  {visibleProviders.map((pspName) => (
    <ProviderNode key={pspName} ... />
  ))}
  
  {hasMoreProviders && (
    <MoreProvidersNode count={hiddenProviders.length} />
  )}
</div>
```

### 4. "More Providers" Node

**Interactive Node for 6+ Providers:**
- Shows "+N More" with count of hidden providers
- Dashed border with hover effect
- Opens modal on click

**Modal Features:**
- Full list of all providers in 2-column grid
- Shows active/inactive status
- Item count badges for active providers
- Scrollable for large lists (30+ providers)

### 5. Dynamic Connection Lines

**Updated Path Calculation:**
```typescript
// OLD: Hardcoded PSP_CONFIG keys
Object.keys(PSP_CONFIG).forEach(pspName => { ... });

// NEW: Dynamic visible providers
visibleProviders.forEach(pspName => {
  const config = pspConfig[pspName];
  const color = config?.color || '#9CA3AF';
  // Draw bezier curve from Revelius to PSP
});
```

**Dependency Updates:**
- Path calculation depends on `visibleProviders` and `pspConfig`
- Layout recalculates when provider count changes
- Port system adapts to dynamic node positions

### 6. Routing Logic Updates

**Updated buildRoutingModel Function:**
```typescript
// OLD: Fixed PSP list
const allPSPs: PSPName[] = ['Stripe', 'Adyen', 'Fiserv', 'Checkout', 'Worldpay'];

// NEW: Dynamic from routing table
function buildRoutingModel(tx: MockTransaction, availableProviders: string[]) {
  const allPSPs: PSPName[] = availableProviders.length > 0 
    ? availableProviders 
    : ['stripe', 'adyen', 'fiserv', 'checkout', 'worldpay'];
  
  // Smart routing with fallbacks for missing providers
  if (signals.includes('tobacco')) {
    targetPSP = allPSPs.includes('fiserv') ? 'fiserv' : allPSPs[2] || allPSPs[0];
  }
  // etc...
}
```

### 7. Visual Enhancements

**Provider Display Names:**
- Uses `getProviderDisplayName()` for proper Title Case formatting
- "stripe" → "Stripe", "adyen" → "Adyen", etc.

**Responsive Layout:**
- Grid adapts to 1-6 visible providers
- "More providers" node fills grid naturally
- Maintains consistent spacing and alignment

**Token Animations:**
- Updated to use dynamic `pspConfig` colors
- Fallback to gray for unknown providers
- Smooth animations along bezier curves

## Acceptance Criteria Met

✅ Visual renders correctly with 3 providers  
✅ Visual renders correctly with 6 providers  
✅ Visual renders correctly with 30+ providers  
✅ No overlapping or off-screen nodes  
✅ Works responsive (2-column grid layout)  
✅ Provider nodes created from routing table  
✅ Up to 6 providers shown in grid  
✅ "More providers" node for 6+ providers  
✅ Modal shows all providers with scroll  
✅ Connections drawn to dynamic coordinates  
✅ Stable colors from design system  
✅ Provider names in Title Case  
✅ No linter errors  

## Technical Details

### Layout Algorithm
1. Calculate visible provider count (max 6)
2. Add 1 if "More providers" node needed
3. Calculate grid rows: `Math.ceil(count / 2)`
4. Calculate stack height: `(height + gap) * rows - gap`
5. Position grid at `pspStartX` with vertical centering

### Provider Config Priority
1. Check `DEFAULT_PSP_CONFIG` for known providers
2. Generate config with stable color from `PROVIDER_COLORS` array
3. Use Clearbit logo API for unknown providers
4. Fallback to gray (#9CA3AF) if all else fails

### State Management
- `visibleProviders`: First 6 providers from routing table
- `hiddenProviders`: Remaining providers (7+)
- `showMoreProviders`: Modal visibility state
- `pspConfig`: Memoized provider configurations

### Performance
- Memoized provider config computation
- Efficient grid layout (CSS Grid)
- Minimal re-renders with proper dependencies
- Smooth animations with Framer Motion

## Testing Scenarios

### 3 Providers
- Grid shows 3 nodes (2 in first row, 1 in second)
- No "More providers" node
- All connections visible

### 6 Providers
- Grid shows 6 nodes (3 rows × 2 columns)
- No "More providers" node
- All connections visible

### 30 Providers
- Grid shows 6 provider nodes + 1 "More providers" node
- "+24 More" displayed
- Modal shows all 30 providers in scrollable grid
- Only 6 connections drawn (for visible providers)

## Future Enhancements

Potential improvements:
- Search/filter in "More providers" modal
- Provider statistics in modal (approval rate, volume, etc.)
- Drag-and-drop to reorder providers
- Custom provider colors via settings
- Export/import provider configurations
