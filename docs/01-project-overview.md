# Hemp Farm Game - Project Overview

## Project Description
Hemp Farm Game is a browser-based idle farming simulation game built with React, TypeScript, and Vite. Players manage a hemp farm by planting crops, building facilities, employing pets for automation, and expanding their operation through strategic resource management.

## Technology Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0
- **State Management**: React useState hooks with localStorage persistence
- **Deployment**: Netlify (via Bolt Hosting)

## Core Game Mechanics
1. **Resource Management**: Players manage money ($) and hemp inventory
2. **Crop Lifecycle**: Plant → Grow → Harvest → Sell cycle
3. **Facility Construction**: Storage and bank buildings for capacity expansion
4. **Pet Automation**: Automated harvesting with speed bonuses
5. **Progression System**: Level-based upgrades for crops, facilities, and farm
6. **Tile-Based Grid**: 5-column expandable grid system

## Key Features
- Real-time progress tracking with visual indicators
- Offline-capable with application cache manifest
- Responsive design for mobile and desktop
- Persistent game state with localStorage
- Visual feedback with hover states and animations
- Background music and sound effects integration ready

## Game Flow
1. Start with basic farm (3x5 grid, $100, 1 pet)
2. Plant crops using available money
3. Wait for crops to grow or employ pets for automation
4. Harvest crops to gain hemp
5. Sell hemp for money to expand operations
6. Build storage/banks to increase capacity limits
7. Level up crops and facilities for efficiency
8. Expand farm level to unlock more tiles and features

## Performance Considerations
- Optimized rendering with React.memo where appropriate
- Efficient state updates using functional setState patterns
- Minimal re-renders through careful dependency management
- Image optimization using external CDN links
- Lazy loading of non-critical components