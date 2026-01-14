# Routing Table Eligibility Implementation

## Overview
Implemented routing table eligibility filtering for route options per transaction/SKU. Route options now show only eligible providers based on SKU categories instead of showing all providers.

## Changes Made

### 1. Core Utilities (`src/utils/routingEligibility.ts`)
Created utility functions for computing provider eligibility:
- `computeCartEligibility()` - Computes eligible providers for a cart of SKUs
- `computeLineItemsEligibility()` - Computes eligible providers for line items
- `getProvidersForCategory()` - Gets eligible providers for a single category

**Key Features:**
- Calculates coverage count and percentage for each provider
- Identifies full coverage vs partial coverage providers
- Sorts providers by coverage (desc), then by default status
- Returns structured eligibility data with coverage metrics

### 2. Provider Selection Component (`src/components/EligibleProvidersSelector.tsx`)
New component for displaying and selecting eligible providers:

**Features:**
- **Chips Display**: Shows first 6 eligible providers as chips with coverage indicators
- **"+N more" Button**: Expands to show all providers when there are more than 6
- **Dropdown Selector**: Allows manual provider selection (when not read-only)
- **Coverage Indicators**: Each chip shows "Covers N/M items"
- **Default PSP Badge**: Highlights the default PSP
- **Visual Feedback**: Selected provider highlighted with checkmark
- **Expandable List**: Full provider list with coverage percentages

**Props:**
- `eligibleProviders` - List of providers with coverage data
- `selectedProvider` - Currently selected provider
- `totalItems` - Total number of items in cart
- `onProviderSelect` - Callback for provider selection
- `readOnly` - Whether selection is enabled

### 3. Cart Routing Decision (`src/components/evidence/CartRoutingDecision.tsx`)
Updated to use eligibility-based provider selection:

**Changes:**
- Added `EligibleProvidersSelector` component at the top
- Supports manual provider selection via `manuallySelectedProvider` state
- Dynamically updates coverage display based on selected provider
- Shows "Covers N/M items" instead of "N/M SKUs"
- Updates missing categories based on selected provider
- Highlights selected provider in SKU routing table

### 4. Routing Decision Block (`src/components/evidence/RoutingDecisionBlock.tsx`)
Updated to use eligibility-based provider selection:

**Changes:**
- Added `EligibleProvidersSelector` component at the top
- Supports manual provider selection via `manuallySelectedProvider` state
- Dynamically updates coverage display based on selected provider
- Shows coverage count instead of category count in badge
- Updates explanation text when provider is manually selected
- Highlights selected provider in supported providers list

### 5. Type Updates (`src/types/products.ts`)
Extended `RoutingTable` type to support both naming conventions:
```typescript
export type RoutingTable = {
  default_psp: string;
  mapping?: Record<string, string[]>;
  provider_category_mapping?: Record<string, string[]>;
};
```

## User Experience

### SKU-Level Options
- Given `sku.category_id`, eligible providers are those where `mapping[provider]` includes `category_id`
- Providers shown as chips with coverage indicators
- User can manually select any eligible provider

### Cart-Level Options
1. **Full Coverage**: Providers that cover ALL SKUs are shown first
2. **Partial Coverage**: If no full coverage, shows:
   - Providers sorted by coverage count (desc)
   - Default PSP pinned at top (with "Default" badge)
3. **Coverage Indicator**: Each provider shows "Covers N/M items"

### UI Components
- **Eligible Providers Chips**: First 6 providers visible, "+N more" for additional
- **Select Provider Dropdown**: Full list with coverage percentages
- **Coverage Badge**: Shows "Covers N/M items" on selected PSP card
- **Coverage Bar**: Visual representation of coverage percentage
- **Missing Categories**: Warning when provider doesn't support all categories

## Acceptance Criteria Met

✅ Route options reflect real eligibility from routing_table
✅ Default PSP is always available as a fallback choice
✅ SKU-level options show providers eligible for the SKU's category
✅ Cart-level options show providers sorted by coverage
✅ Default PSP is pinned at top with badge
✅ Coverage indicators show "Covers N/M items"
✅ UI shows eligible provider chips (max 6 visible + "+N more")
✅ Dropdown allows provider selection from eligible list
✅ No linter errors

## Testing
- No TypeScript compilation errors
- No ESLint errors
- Components properly typed with full type safety
- Backward compatible with existing routing table structure

## Notes
- The implementation supports both `mapping` and `provider_category_mapping` keys in the routing table for backward compatibility
- Manual provider selection is supported but defaults to computed best-coverage provider
- Coverage calculations are based on item count, not just category count
- Default PSP is always shown even if it has 0% coverage (as fallback)
