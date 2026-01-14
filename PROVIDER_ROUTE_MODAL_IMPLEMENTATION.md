# Provider Route Selection Modal Implementation

## Overview
Implemented a comprehensive route selection modal that opens when clicking provider nodes. The modal shows routing details, coverage information, and allows users to select providers for routing.

## Changes Made

### 1. ProviderRouteModal Component (`src/components/routing/ProviderRouteModal.tsx`)

**New Modal Component with Rich Features:**

**Header Section:**
- Provider display name (Title Case)
- "Default PSP" badge for default providers
- "✓ Selected" badge for currently selected provider
- Close button

**Coverage Summary Card:**
- Visual coverage indicator (✓ Full, ⚠️ Partial, ✕ None)
- Coverage count: "Supports X/Y items"
- Coverage percentage with color coding:
  - Green (emerald) for full coverage (100%)
  - Amber for partial coverage (1-99%)
  - Red for no coverage (0%)
- Coverage bar visualization
- Contextual explanation text

**Items List:**
- **Supported Items Section:**
  - Green checkmark icons
  - Item title and SKU
  - Category badge (emerald)
  - Grouped in emerald-themed cards

- **Unsupported Items Section:**
  - Amber warning icons
  - Item title and SKU
  - Category badge (red)
  - Explanation: "This category is not supported by {provider}"
  - Grouped in amber-themed cards

**Footer:**
- Status message:
  - ✓ Full coverage — recommended
  - ⚠️ Partial coverage — some items may need alternative routing
  - ✕ No coverage — not recommended
- Cancel button
- "Select this provider" button (disabled if 0% coverage)
- "Currently Selected" indicator if already selected

**Props Interface:**
```typescript
interface ProviderRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: string;
  coverage?: ProviderCoverage;
  items?: (SKU | LineItem)[];
  onSelect?: () => void;
  isSelected?: boolean;
}
```

### 2. CartRoutingDecision Integration

**Added Modal Support:**
```typescript
const [modalProvider, setModalProvider] = useState<string | null>(null);

// Open modal on provider click
onProviderSelect={(provider) => {
  setModalProvider(provider);
}}

// Render modal
<ProviderRouteModal
  open={!!modalProvider}
  onOpenChange={(open) => !open && setModalProvider(null)}
  provider={modalProvider}
  coverage={modalCoverage}
  items={cart}
  onSelect={() => setManuallySelectedProvider(modalProvider)}
  isSelected={displayedProvider === modalProvider}
/>
```

**Features:**
- Clicking provider chips opens modal
- Modal shows cart items with coverage
- Selecting provider updates routing decision
- Selected provider highlighted in UI

### 3. RoutingDecisionBlock Integration

**Added Modal Support:**
```typescript
const [modalProvider, setModalProvider] = useState<string | null>(null);

// Open modal on provider click
onProviderSelect={(provider) => {
  setModalProvider(provider);
}}

// Render modal
<ProviderRouteModal
  open={!!modalProvider}
  onOpenChange={(open) => !open && setModalProvider(null)}
  provider={modalProvider}
  coverage={modalCoverage}
  items={lineItems}
  onSelect={() => setManuallySelectedProvider(modalProvider)}
  isSelected={displayedProvider === modalProvider}
/>
```

**Features:**
- Clicking provider chips opens modal
- Modal shows line items with coverage
- Selecting provider updates routing decision
- Selected provider highlighted in UI

### 4. Demo.tsx Routing Visual Integration

**Added Click Handlers to Provider Nodes:**
```typescript
const [modalProvider, setModalProvider] = useState<PSPName | null>(null);
const [selectedProvider, setSelectedProvider] = useState<PSPName | null>(null);

// Make provider nodes clickable
onClick={() => setModalProvider(pspName)}

// Highlight selected provider
const isSelectedProvider = selectedProvider === pspName;
const borderColor = isSelectedProvider ? 'border-emerald-500' : ...;
const bgColor = isSelectedProvider ? 'bg-emerald-50' : ...;
```

**Visual Highlighting:**
- Selected provider node has emerald border and background
- "✓ Selected" text shown below provider name
- Connection line to selected provider is thicker and emerald green
- Connection dots are larger and emerald for selected provider
- Other providers dimmed when one is selected

**Eligibility Calculation:**
```typescript
const eligibilityResult = useMemo(() => {
  if (!selectedTransaction || !routingTable) return null;
  
  // Convert transaction items to SKUs
  const skus: SKU[] = selectedTransaction.items.map((item) => ({
    sku_id: item.sku,
    title: item.title,
    category_id: item.type, // Use type as category_id
    // ... other fields
  }));
  
  return computeCartEligibility(skus, routingTable);
}, [selectedTransaction, routingTable]);
```

**Modal Integration:**
```typescript
<ProviderRouteModal
  open={!!modalProvider}
  onOpenChange={(open) => !open && setModalProvider(null)}
  provider={modalProvider}
  coverage={modalCoverage}
  items={modalItems}
  onSelect={() => setSelectedProvider(modalProvider)}
  isSelected={selectedProvider === modalProvider}
/>
```

### 5. "More Providers" Modal Enhancement

**Added Click Handlers:**
- All providers in "More providers" modal are now clickable
- Clicking opens the ProviderRouteModal
- Selected provider shown with emerald styling and "✓ Selected" badge
- Modal closes automatically when provider clicked

### 6. Visual Path Highlighting

**Enhanced Connection Lines:**
```typescript
// Selected provider gets special styling
stroke={isSelectedProvider ? '#10b981' : path.color}
strokeWidth={isSelectedProvider ? 5 : isHovered ? 4 : isActive ? 3 : 2}
opacity={isDimmed ? 0.15 : isSelectedProvider ? 1.0 : isActive ? 0.8 : 0.3}

// Endpoint dots
r={isSelectedProvider ? 5 : isHovered ? 4 : 3}
fill={isSelectedProvider ? '#10b981' : path.color}
```

**Dimming Logic:**
- When provider selected: dim all other providers and paths
- When provider hovered: dim all other providers and paths
- Selected provider always at full opacity

## User Experience Flow

### 1. Provider Selection in Evidence Components

**CartRoutingDecision / RoutingDecisionBlock:**
1. User sees eligible provider chips
2. Clicks a provider chip
3. Modal opens showing:
   - Coverage summary
   - Supported items (green)
   - Unsupported items (amber)
4. User clicks "Select this provider"
5. Modal closes
6. UI updates to show selected provider
7. Coverage indicators update

### 2. Provider Selection in Demo Visual

**Routing Canvas:**
1. User sees provider nodes in grid
2. Clicks a provider node
3. Modal opens showing:
   - Coverage for transaction items
   - Item-by-item breakdown
4. User clicks "Select this provider"
5. Modal closes
6. Provider node highlighted with emerald styling
7. Connection line becomes thicker and emerald
8. Other providers dimmed
9. "✓ Selected" badge appears

### 3. More Providers Modal

**Extended Provider List:**
1. User clicks "+N More" node
2. Modal opens with all providers
3. User clicks a provider
4. "More providers" modal closes
5. ProviderRouteModal opens
6. User can select provider
7. Visual updates accordingly

## Acceptance Criteria Met

✅ Every provider node is clickable and opens modal  
✅ Modal shows provider name  
✅ Modal shows coverage: "Supports X/Y items"  
✅ Modal lists supported SKUs with ✅  
✅ Modal lists unsupported SKUs with ⚠️  
✅ Modal has "Select this provider" button  
✅ Selecting updates transaction's selected provider  
✅ Modal closes after selection  
✅ Visual rerenders to highlight chosen provider path  
✅ UI updates consistently across all components  
✅ No linter errors  

## Technical Details

### State Management
- **Local State**: Each component manages its own `modalProvider` and `selectedProvider` state
- **Modal Provider**: Tracks which provider's modal is open
- **Selected Provider**: Tracks which provider is currently selected for routing

### Coverage Calculation
- Uses `computeCartEligibility()` utility
- Calculates coverage based on category mappings
- Returns structured data with coverage metrics
- Supports both SKU and LineItem types

### Visual Updates
- **Provider Nodes**: Border, background, and badge styling
- **Connection Lines**: Color, width, and opacity changes
- **Connection Dots**: Size and color changes
- **Dimming**: Other providers fade when one is selected

### Responsive Design
- Modal is scrollable for long item lists
- Max height: 85vh
- Grid layout for items
- Works on all screen sizes

## Performance Considerations

- Memoized eligibility calculations
- Efficient state updates
- Minimal re-renders with proper dependencies
- Smooth animations with Framer Motion

## Future Enhancements

Potential improvements:
- Provider comparison mode (select multiple to compare)
- Historical routing performance data in modal
- Cost estimates per provider
- Approval rate predictions
- Alternative provider suggestions
- Bulk item routing (split cart across providers)
