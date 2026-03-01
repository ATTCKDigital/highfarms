# Hemp Farm Game - User Interface Specification

## Layout Structure

### Main Application Layout
```
┌─────────────────────────────────────┐
│           Status Bar                │ ← Fixed header with resources
├─────────────────────────────────────┤
│                                     │
│           Game Board                │ ← Scrollable grid area
│         (Tile Grid)                 │
│                                     │
├─────────────────────────────────────┤
│        Harvest All Button          │ ← Floating action button
└─────────────────────────────────────┘
```

## Status Bar Component

### Visual Design
- **Background**: Custom image with wood texture
- **Height**: Auto-sizing with padding
- **Shadow**: `shadow-[0_4px_20px_rgba(0,0,0,0.4)]`
- **Position**: Fixed at top, z-index 10

### Resource Displays
1. **Money Display**
   - Icon: Dollar sign ($)
   - Progress bar: Yellow fill showing balance/maxBalance ratio
   - Format: `$X,XXX / $X,XXX`
   - Clickable: No

2. **Hemp Display**
   - Icon: Leaf (Lucide React)
   - Progress bar: Green fill showing hemp/maxStorage ratio
   - Format: `X,XXX / X,XXX`
   - Clickable: Yes (opens sell popup when ≥100 hemp)

3. **Farm Management**
   - Icon: Warehouse (Lucide React)
   - Clickable: Yes (opens farm level popup)

### Progress Bar Styling
- Container: `w-32 h-2 bg-black/20 rounded-full`
- Fill: Colored bar with transition animation
- Text Overlay: Centered, white text with drop shadow

## Game Board Component

### Grid Layout
- **Container**: CSS Grid with 5 columns
- **Gap**: `gap-1` (4px between tiles)
- **Max Width**: 600px, centered
- **Background**: Soil texture pattern
- **Responsive**: Maintains aspect ratio on all devices

### Tile Dimensions
- **Aspect Ratio**: 1:1 (square tiles)
- **Size**: Responsive based on container width
- **Border Radius**: `rounded-md`
- **Hover Effect**: White dotted border overlay

## Tile Component States

### Empty Tile
- **Background**: Random soil texture (4 variations)
- **Overlay**: `bg-green-900/60` dark tint
- **Indicator**: Tile number in bottom-right corner
- **Hover**: Border highlight

### Crop Tile
- **Background**: Growth stage dependent
  - Growing: Young plant texture
  - Ready: Mature plant texture
  - With Pet: Automated farm texture
- **Level Badge**: Top-left corner, `bg-black/40`
- **Timer**: Top-right when growing
- **Progress Bar**: Bottom edge, green fill
- **Pet Indicator**: Bottom-right when assigned
- **Harvest Button**: Center when ready (non-automated)

### Storage Facility
- **Background**: Level-dependent building texture
  - Level 1: Basic warehouse
  - Level 2: Improved warehouse
  - Level 3: Advanced warehouse
  - Level 4+: Premium warehouse
- **Construction**: Building animation texture when constructing
- **Level Badge**: Top-left corner
- **Progress Bar**: Bottom edge during construction/upgrade

### Bank Facility
- **Background**: Bank building texture
- **Construction**: Building animation when constructing
- **Level Badge**: Top-left corner
- **Progress Bar**: Bottom edge during construction/upgrade

## Popup Components

### Modal Structure
- **Backdrop**: `bg-black/50` full screen overlay
- **Container**: White rounded card, centered
- **Max Width**: 448px (max-w-md)
- **Shadow**: `shadow-[0_4px_20px_rgba(0,0,0,0.4)]`
- **Close**: X button in top-right corner

### Plant Options Popup
- **Trigger**: Click empty tile
- **Options**: 
  1. Plant Crop (cost display)
  2. Build Storage (cost + current capacity)
  3. Build Bank (cost + current capacity)
- **Buttons**: Full-width with custom background images

### Crop Management Popup
- **Trigger**: Click crop tile
- **Information**: Plant date, growth time, pet status
- **Actions**:
  - Level Up (if affordable and not max level)
  - Harvest (if ready and no pet)
  - Employ/Remove Pet
  - Move Crop
- **Conditional Display**: Actions based on crop state

### Storage Management Popup
- **Trigger**: Click storage facility
- **Information**: Build date, level, capacity contribution
- **Actions**:
  - Upgrade (if affordable and not max level)
  - Move Storage
- **Status**: Construction/upgrade progress

### Farm Level Popup
- **Trigger**: Click warehouse icon in status bar
- **Sections**:
  1. Current farm benefits
  2. Level up requirements
  3. Pet management overview
- **Level Up Button**: Requires both money and hemp

### Sell Hemp Popup
- **Trigger**: Click hemp display (when ≥100 hemp)
- **Information**: Current hemp, sell rate, profit calculation
- **Action**: Sell maximum possible amount

## Visual Feedback

### Hover States
- **Tiles**: Subtle border highlight
- **Buttons**: Opacity change to 90%
- **Status Icons**: Color shift to yellow

### Progress Animations
- **Progress Bars**: Smooth width transitions over 1 second
- **Construction**: Pulsing effect during build phases
- **Harvest Ready**: Yellow glow overlay

### Button Styling
- **Primary Actions**: Custom background images with wood/stone textures
- **Secondary Actions**: Solid color backgrounds
- **Disabled States**: 50% opacity with cursor-not-allowed
- **Loading States**: Progress indicators where applicable

## Responsive Design

### Mobile Optimizations
- **Text Sizes**: Smaller fonts on mobile (`text-[10px] sm:text-xs`)
- **Touch Targets**: Minimum 44px for interactive elements
- **Grid Scaling**: Maintains playability on small screens
- **Popup Sizing**: Full-width with margins on mobile

### Desktop Enhancements
- **Hover Effects**: More pronounced on larger screens
- **Larger Text**: Better readability with larger fonts
- **Precise Interactions**: Mouse-optimized click targets