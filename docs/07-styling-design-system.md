# Hemp Farm Game - Styling and Design System Specification

## Design Philosophy

### Visual Theme
- **Aesthetic**: Cartoonish, friendly farming simulation
- **Color Palette**: Earth tones with vibrant accent colors
- **Typography**: Clean, readable fonts with gaming appeal
- **Imagery**: Hand-drawn style illustrations and textures

### Design Principles
1. **Clarity**: Information hierarchy through visual weight
2. **Consistency**: Unified visual language across components
3. **Accessibility**: High contrast and readable text
4. **Responsiveness**: Seamless experience across devices
5. **Performance**: Optimized assets and efficient rendering

## Typography System

### Font Stack
```css
font-family: 'Archivo', system-ui, sans-serif;
```

### Font Weights
- **Regular (400)**: Body text and standard UI elements
- **Medium (500)**: Emphasized text and secondary headings
- **Semi-bold (600)**: Important labels and primary headings
- **Bold (700)**: Critical information and call-to-action text

### Font Size Scale
```css
/* Mobile-first responsive typography */
text-[8px]     /* 8px - Tiny labels */
text-[10px]    /* 10px - Small mobile text */
text-xs        /* 12px - Standard mobile text */
text-sm        /* 14px - Standard desktop text */
text-base      /* 16px - Body text */
text-lg        /* 18px - Large text */
text-xl        /* 20px - Headings */
text-2xl       /* 24px - Large headings */
```

### Text Styling Patterns
```css
/* Drop shadow for text on images */
drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]

/* Text overlay on progress bars */
.progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: medium;
}
```

## Color System

### Primary Colors
```css
/* Green (Nature/Growth) */
--green-500: #10b981;    /* Progress bars, success states */
--green-900: #064e3b;    /* Dark overlays, backgrounds */

/* Yellow (Gold/Money) */
--yellow-400: #fbbf24;   /* Highlights, selection states */
--yellow-500: #f59e0b;   /* Money progress, harvest ready */

/* Blue (Technology/Buildings) */
--blue-500: #3b82f6;     /* Storage progress, info states */
--blue-600: #2563eb;     /* Pet indicators, automation */
```

### Neutral Colors
```css
/* Grayscale */
--gray-50: #f9fafb;      /* Light backgrounds */
--gray-100: #f3f4f6;     /* Card backgrounds */
--gray-500: #6b7280;     /* Secondary text */
--gray-600: #4b5563;     /* Body text */
--gray-700: #374151;     /* Headings */
--gray-800: #1f2937;     /* Dark text */

/* Semantic Colors */
--red-500: #ef4444;      /* Error states, warnings */
--white: #ffffff;        /* Text on dark backgrounds */
--black: #000000;        /* High contrast text */
```

### Opacity Modifiers
```css
/* Background overlays */
bg-black/20    /* 20% black overlay */
bg-black/40    /* 40% black overlay */
bg-black/50    /* 50% black overlay */
bg-green-900/60 /* 60% green overlay */

/* Hover states */
bg-white/0     /* Transparent base */
bg-white/5     /* Subtle hover effect */
```

## Layout System

### Grid System
```css
/* Main game grid */
.game-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.25rem; /* 4px */
  max-width: 600px;
  margin: 0 auto;
}

/* Tile aspect ratio */
.tile {
  aspect-ratio: 1 / 1;
  width: 100%;
}
```

### Spacing Scale
```css
/* Tailwind spacing scale */
gap-1     /* 4px - Tight spacing */
gap-2     /* 8px - Standard spacing */
gap-4     /* 16px - Comfortable spacing */
gap-6     /* 24px - Loose spacing */
gap-8     /* 32px - Section spacing */

/* Padding scale */
p-1       /* 4px - Minimal padding */
p-2       /* 8px - Tight padding */
p-4       /* 16px - Standard padding */
p-6       /* 24px - Comfortable padding */
```

### Container Patterns
```css
/* Modal containers */
.modal-container {
  max-width: 28rem; /* 448px */
  width: 100%;
  margin: 0 1rem;
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

/* Card containers */
.card {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
}
```

## Component Styling

### Button System
```css
/* Primary action buttons */
.btn-primary {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.25);
  transition: opacity 0.2s;
  background-image: url('custom-texture.png');
  background-size: cover;
  background-position: center;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Secondary buttons */
.btn-secondary {
  background: solid color;
  /* Similar structure with different styling */
}
```

### Progress Bar System
```css
.progress-container {
  width: 8rem; /* 128px */
  height: 0.5rem; /* 8px */
  background: rgba(0, 0, 0, 0.2);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  transition: width 1s ease-in-out;
  border-radius: inherit;
}

/* Color variants */
.progress-fill.money { background: #f59e0b; }
.progress-fill.hemp { background: #10b981; }
.progress-fill.build { background: #3b82f6; }
```

### Tile Styling System
```css
.tile-base {
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  border-radius: 0.375rem;
  background-size: cover;
  background-position: center;
}

.tile-base:hover {
  border: 1px dotted rgba(255, 255, 255, 0.3);
}

/* State-specific overlays */
.tile-empty::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(5, 46, 22, 0.6);
}

.tile-harvestable::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(245, 158, 11, 0.2);
}
```

## Background and Texture System

### Background Images
```css
/* Status bar background */
.status-bar {
  background-image: url('wood-texture.png');
  background-size: cover;
  background-position: center;
}

/* Game board background */
.game-board::before {
  background-image: 
    linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
    url('soil-pattern.png');
  background-size: 200px;
  background-repeat: repeat;
}

/* Main app background */
.app-background {
  background-image: url('farm-landscape.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
```

### Tile Texture Mapping
```css
/* Empty tiles - 4 variations */
.tile-empty-1 { background-image: url('soil-1.png'); }
.tile-empty-2 { background-image: url('soil-2.png'); }
.tile-empty-3 { background-image: url('soil-3.png'); }
.tile-empty-4 { background-image: url('soil-4.png'); }

/* Crop states */
.tile-crop-growing { background-image: url('young-plant.png'); }
.tile-crop-ready { background-image: url('mature-plant.png'); }
.tile-crop-automated { background-image: url('automated-farm.png'); }

/* Buildings */
.tile-storage-1 { background-image: url('warehouse-basic.png'); }
.tile-storage-2 { background-image: url('warehouse-improved.png'); }
.tile-storage-3 { background-image: url('warehouse-advanced.png'); }
.tile-storage-4 { background-image: url('warehouse-premium.png'); }
.tile-bank { background-image: url('bank-building.png'); }
.tile-construction { background-image: url('construction.png'); }
```

## Animation System

### Transition Patterns
```css
/* Standard transitions */
.transition-standard {
  transition: all 0.2s ease-in-out;
}

/* Progress animations */
.progress-animate {
  transition: width 1s ease-in-out;
}

/* Hover effects */
.hover-scale:hover {
  transform: scale(1.05);
}

.hover-opacity:hover {
  opacity: 0.9;
}
```

### Loading States
```css
/* Pulsing animation for construction */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.construction-pulse {
  animation: pulse 2s infinite;
}

/* Glow effect for harvest ready */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(245, 158, 11, 0.5); }
  50% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.8); }
}

.harvest-glow {
  animation: glow 2s infinite;
}
```

## Responsive Design System

### Breakpoint Strategy
```css
/* Mobile-first approach */
/* Base styles: Mobile (320px+) */

/* Small tablets and large phones */
@media (min-width: 640px) {
  /* sm: prefix in Tailwind */
}

/* Tablets */
@media (min-width: 768px) {
  /* md: prefix in Tailwind */
}

/* Desktop */
@media (min-width: 1024px) {
  /* lg: prefix in Tailwind */
}
```

### Responsive Patterns
```css
/* Text sizing */
.responsive-text {
  font-size: 10px; /* Mobile base */
}

@media (min-width: 640px) {
  .responsive-text {
    font-size: 12px; /* Tablet and up */
  }
}

/* Grid scaling */
.game-grid {
  width: 100%;
  max-width: 400px; /* Mobile */
}

@media (min-width: 640px) {
  .game-grid {
    max-width: 600px; /* Desktop */
  }
}
```

## Accessibility Styling

### High Contrast Support
```css
/* Ensure sufficient contrast ratios */
.text-on-dark {
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}

.text-on-light {
  color: #1f2937; /* gray-800 */
}

/* Focus indicators */
.focusable:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### Motion Preferences
```css
/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .progress-animate {
    transition: none;
  }
  
  .construction-pulse {
    animation: none;
  }
  
  .harvest-glow {
    animation: none;
  }
}
```

## Performance Considerations

### CSS Optimization
1. **Minimal Custom CSS**: Leverage Tailwind utilities
2. **Efficient Selectors**: Avoid deep nesting
3. **Hardware Acceleration**: Use transform for animations
4. **Critical CSS**: Inline critical styles

### Image Optimization
1. **External CDN**: Use optimized external images
2. **Appropriate Formats**: WebP with fallbacks
3. **Lazy Loading**: Load images as needed
4. **Responsive Images**: Multiple sizes for different screens

### Bundle Size Management
1. **Tailwind Purging**: Remove unused CSS classes
2. **Tree Shaking**: Eliminate unused code
3. **Code Splitting**: Separate critical and non-critical styles
4. **Compression**: Gzip/Brotli compression for assets