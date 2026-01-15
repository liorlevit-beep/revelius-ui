# Dark Gradient Background

Animated gradient background component that only appears in dark mode, inspired by fluid gradient animations.

## Features

- ✅ **Dark mode only**: Automatically detects and only renders in dark mode
- ✅ **Mouse-follow effect**: Interactive blob follows mouse with smooth easing
- ✅ **Slow, ambient animations**: 2-3x slower than typical animated backgrounds
- ✅ **Non-intrusive**: `pointer-events: none`, sits at `z-index: 0` behind all content
- ✅ **No layout impact**: Fixed positioning, no global CSS pollution
- ✅ **Performance**: Uses `requestAnimationFrame` and CSS animations
- ✅ **Accessibility**: Respects `prefers-reduced-motion`

## Usage

### Basic Integration

Already integrated in `src/App.tsx`:

```tsx
import { DarkGradientBackground } from './components/ui/DarkGradientBackground';

function AppContent() {
  return (
    <div className="relative w-full h-screen overflow-x-hidden">
      {/* Background at z-index 0 */}
      <DarkGradientBackground />
      
      {/* Your content at z-index 10+ */}
      <main className="relative z-10">
        {/* ... */}
      </main>
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable the background |
| `intensity` | `'subtle'` \| `'normal'` \| `'strong'` | `'normal'` | Opacity level (0.35 / 0.55 / 0.75) |
| `className` | `string` | `''` | Additional CSS classes |

### Examples

```tsx
// Subtle intensity
<DarkGradientBackground intensity="subtle" />

// Strong intensity
<DarkGradientBackground intensity="strong" />

// Disabled
<DarkGradientBackground enabled={false} />

// With custom class
<DarkGradientBackground className="custom-blend" />
```

## How It Works

### Dark Mode Detection

Uses a `MutationObserver` to watch for class changes on `<html>`:

```tsx
const isDark = document.documentElement.classList.contains('dark');
```

Returns `null` (nothing) in light mode.

### Animation System

**5 Animated Blobs:**
- Each moves in different patterns (circular, vertical, horizontal)
- Durations: 40-90 seconds (very slow, ambient)
- `mix-blend-mode: hard-light` for blend effects

**1 Interactive Blob:**
- Follows mouse with eased lerp: `curX += (targetX - curX) * 0.03`
- Uses `requestAnimationFrame` for smooth 60fps tracking
- Clean cleanup on unmount

### Color Palette

- Blue: `rgba(59, 130, 246, 0.8)` 
- Purple: `rgba(168, 85, 247, 0.8)`
- Pink: `rgba(236, 72, 153, 0.8)`
- Cyan: `rgba(14, 165, 233, 0.8)`
- Indigo: `rgba(99, 102, 241, 0.9)` (interactive)

### Performance

- `filter: blur(80px)` for soft gradient edges
- `will-change: transform` on interactive blob
- `pointer-events: none` - doesn't block clicks
- Animations use GPU-accelerated transforms

## Customization

### Adjust Animation Speed

Edit `darkGradientBackground.module.css`:

```css
.g1 {
  /* Slower = higher duration */
  animation: moveVertical 60s ease infinite;
}
```

### Change Colors

Edit blob backgrounds in CSS:

```css
.g1 {
  background: radial-gradient(
    circle at center,
    rgba(YOUR_COLOR_HERE) 0,
    rgba(YOUR_COLOR_HERE, 0) 50%
  ) no-repeat;
}
```

### Adjust Mouse Easing

Edit `DarkGradientBackground.tsx`:

```tsx
// Slower = smaller number (0.01 = very slow, 0.1 = fast)
currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.03;
```

### Change Blend Mode

Edit `.blob` in CSS:

```css
.blob {
  mix-blend-mode: screen; /* or hard-light, overlay, lighten, etc. */
}
```

## Troubleshooting

### Background not showing

1. **Check dark mode**: Component only renders when `document.documentElement` has `dark` class
2. **Check z-index**: Ensure content has `z-10` or higher
3. **Check if disabled**: `enabled={false}` prop will hide it

### Background blocking clicks

This should never happen (`pointer-events: none`), but if it does:
- Verify no CSS is overriding `pointer-events`
- Check that container has `z-index: 0`

### Too bright/dark

Adjust intensity:
- `subtle` = 35% opacity
- `normal` = 55% opacity
- `strong` = 75% opacity

### Animations too fast/slow

Edit animation durations in CSS module (40-90s range recommended).

### Mouse blob too fast/slow

Adjust lerp factor in component (0.01-0.1 range, currently 0.03).

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Requires support for:
  - CSS animations
  - `mix-blend-mode`
  - `requestAnimationFrame`
  - `MutationObserver`

## Accessibility

- Respects `prefers-reduced-motion`: Disables all animations
- Pure visual enhancement: No functional impact
- Screen readers: Component is decorative only
