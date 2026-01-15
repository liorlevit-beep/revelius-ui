# Living Gradient Background

## Overview

A unified animated gradient background component that works beautifully in **both light and dark modes**. Uses the same animation logic and timing across themes, with only color palettes adapting to maintain appropriate contrast and mood.

## Features

✨ **Dual-Mode Design**
- Light mode: Soft, luminous pastels with white veil overlay
- Dark mode: Deep, vibrant colors with dramatic contrast
- Seamless theme switching with CSS tokens

🎨 **Living Animation**
- 5 independent gradient blobs with circular/vertical/horizontal motion
- Interactive blob that smoothly follows mouse cursor
- 40-90 second animation cycles for organic, non-repetitive movement
- GPU-accelerated transforms for 60fps performance

♿ **Accessibility**
- Respects `prefers-reduced-motion` preference
- No animation for users who prefer reduced motion
- Maintains readability with white veil in light mode

🎯 **Performance Optimized**
- Fixed positioning with `pointer-events: none`
- Transform-only animations (GPU layer)
- RequestAnimationFrame for smooth interpolation
- No expensive repaints or reflows

## Architecture

### Component Location
```
src/components/ui/LivingGradientBackground.tsx
```

### CSS Module
```
src/components/ui/livingGradientBackground.module.css
```

### Token Definitions
```
src/index.css (lines 6-71)
```

## CSS Token System

### Light Mode Tokens (`:root`)

```css
/* Base gradient colors */
--bg-grad-base-1: #f0f4ff;  /* Soft pearl blue */
--bg-grad-base-2: #fef3f8;  /* Pale rose */
--bg-grad-base-3: #f0fdf9;  /* Mint whisper */
--bg-grad-base-4: #faf5ff;  /* Lilac mist */

/* Blob colors (low saturation, high luminosity) */
--bg-grad-blob-1: rgba(147, 197, 253, 0.35);  /* Soft sky blue */
--bg-grad-blob-2: rgba(216, 180, 254, 0.32);  /* Pale lavender */
--bg-grad-blob-3: rgba(251, 207, 232, 0.30);  /* Soft pink */
--bg-grad-blob-4: rgba(165, 243, 252, 0.33);  /* Pale cyan */
--bg-grad-blob-5: rgba(196, 181, 253, 0.31);  /* Soft purple */
--bg-grad-blob-interactive: rgba(167, 139, 250, 0.28);  /* Gentle violet */

/* Settings */
--bg-grad-blur: 100px;
--bg-grad-saturate: 120%;
--bg-grad-opacity-normal: 0.60;

/* White veil for legibility */
--bg-grad-veil: rgba(255, 255, 255, 0.75);
--bg-grad-veil-opacity: 1;
```

### Dark Mode Tokens (`.dark`)

```css
/* Base gradient colors */
--bg-grad-base-1: #0a0a0f;  /* Deep obsidian */
--bg-grad-base-2: #1a0f2e;  /* Purple shadow */
--bg-grad-base-3: #0f1a2e;  /* Blue shadow */
--bg-grad-base-4: #0a0a0f;  /* Deep obsidian */

/* Blob colors (vibrant, moody) */
--bg-grad-blob-1: rgba(59, 130, 246, 0.8);   /* Electric blue */
--bg-grad-blob-2: rgba(168, 85, 247, 0.8);   /* Vivid purple */
--bg-grad-blob-3: rgba(236, 72, 153, 0.8);   /* Hot pink */
--bg-grad-blob-4: rgba(14, 165, 233, 0.8);   /* Bright cyan */
--bg-grad-blob-5: rgba(139, 92, 246, 0.8);   /* Deep violet */
--bg-grad-blob-interactive: rgba(99, 102, 241, 0.9);  /* Indigo */

/* Settings */
--bg-grad-blur: 80px;
--bg-grad-saturate: 150%;
--bg-grad-opacity-normal: 0.55;

/* No veil in dark mode */
--bg-grad-veil: transparent;
--bg-grad-veil-opacity: 0;
```

## Usage

### Basic Implementation

```tsx
import { LivingGradientBackground } from './components/ui/LivingGradientBackground';

function App() {
  return (
    <div className="app-container">
      <LivingGradientBackground intensity="normal" />
      {/* Your app content */}
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable the gradient |
| `intensity` | `'subtle' \| 'normal' \| 'strong'` | `'normal'` | Controls blob opacity |
| `className` | `string` | `''` | Additional CSS classes |

### Intensity Levels

- **subtle**: 45% opacity (light), 35% opacity (dark)
- **normal**: 60% opacity (light), 55% opacity (dark)
- **strong**: 75% opacity (light), 75% opacity (dark)

## Layer Stack

When rendered, the component creates these layers (bottom to top):

1. **Base gradient layer** - Multi-stop linear gradient using `--bg-grad-base-*`
2. **Animated blob layer** - 6 radial gradients with motion animations
3. **White veil layer** - Semi-transparent white overlay (light mode only)
4. *(Your app content renders above this)*

## Animation Timings

All animations use the same timing in both light and dark modes:

| Blob | Animations | Duration |
|------|-----------|----------|
| g1 | moveVertical + moveHorizontal | 50s + 80s |
| g2 | moveInCircle (reverse) + moveHorizontal | 40s + 60s |
| g3 | moveInCircle + moveVertical | 60s + 70s |
| g4 | moveHorizontal + moveVertical | 70s + 60s |
| g5 | moveInCircle + moveHorizontal | 50s + 90s |
| interactive | Mouse-follow with 0.03 lerp easing | Real-time |

## Customization

### Adjusting Light Mode Colors

To make light mode more vibrant or more subtle:

```css
:root {
  /* Increase alpha for more vibrance */
  --bg-grad-blob-1: rgba(147, 197, 253, 0.45); /* was 0.35 */
  
  /* Decrease veil opacity for more color */
  --bg-grad-veil: rgba(255, 255, 255, 0.65); /* was 0.75 */
}
```

### Adjusting Animation Speed

In `livingGradientBackground.module.css`, edit the animation durations:

```css
.g1 {
  /* Faster: 25s + 40s */
  /* Slower: 100s + 160s */
  animation: moveVertical 50s ease infinite, moveHorizontal 80s ease infinite;
}
```

## Performance Notes

- **Fixed positioning** (`position: fixed`) keeps it on its own layer
- **pointer-events: none** prevents interaction overhead
- **will-change: transform** on interactive blob promotes to GPU layer
- **RequestAnimationFrame** ensures smooth 60fps mouse following
- **Blur filter** is applied to container, not individual blobs (one composite operation)

## Testing

### Visual Verification

1. **Light Mode Test**
   - Toggle to light mode
   - Gradient should be visible but subtle
   - White veil should maintain text contrast
   - Mouse movement should show interactive blob

2. **Dark Mode Test**
   - Toggle to dark mode
   - Gradient should be vibrant and dramatic
   - No white veil should be visible
   - Mouse movement should show interactive blob

3. **Theme Toggle Test**
   - Toggle between modes repeatedly
   - Transition should be smooth
   - No flash or jarring changes

### Accessibility Test

Enable "Reduce motion" in system preferences:
- Animations should stop completely
- Interactive blob should hide
- Static gradient base should remain

## Migration from DarkGradientBackground

The old `DarkGradientBackground` component is deprecated. To migrate:

```diff
- import { DarkGradientBackground } from './components/ui/DarkGradientBackground';
+ import { LivingGradientBackground } from './components/ui/LivingGradientBackground';

- <DarkGradientBackground intensity="normal" />
+ <LivingGradientBackground intensity="normal" />
```

The new component works automatically in both modes - no props change needed!

## Troubleshooting

**Q: Gradient not visible in light mode?**
- Check `:root` tokens are defined in `index.css`
- Verify `--bg-grad-veil-opacity` is not set to `0`
- Ensure no z-index conflicts

**Q: Dark mode colors changed?**
- Verify `.dark` tokens match original values
- Check no other styles are overriding the tokens

**Q: Performance issues?**
- Reduce intensity to `subtle`
- Check browser DevTools Performance tab for repaints
- Ensure `pointer-events: none` is applied

**Q: Text not readable in light mode?**
- Increase `--bg-grad-veil` opacity to `0.85`
- Reduce blob alpha values
- Ensure content surfaces have proper backgrounds

## File Structure

```
src/
├── components/
│   └── ui/
│       ├── LivingGradientBackground.tsx          ← Component
│       ├── livingGradientBackground.module.css   ← Styles
│       └── README_LivingGradientBackground.md    ← This file
└── index.css                                      ← Tokens (lines 6-71)
```

## Related Components

- `DashboardLiquidGlassTheme.tsx` - Dark mode theme wrapper
- `GlassPanel.tsx` - Glass surface components that sit on top
- `ThemeContext.tsx` - Theme state management

---

**Last Updated:** 2026-01-15  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
