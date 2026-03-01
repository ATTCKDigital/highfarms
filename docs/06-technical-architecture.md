# Hemp Farm Game - Technical Architecture Specification

## Application Architecture

### Component Hierarchy
```
App (Root Component)
├── StatusBar
│   ├── Resource Displays (Money, Hemp, Farm Level)
│   └── Popup Modals (Sell Hemp, Farm Management)
├── GameBoard
│   └── Tile Components (Grid Layout)
│       ├── Empty Tiles
│       ├── Crop Tiles
│       ├── Storage Tiles
│       └── Bank Tiles
├── TilePopup (Conditional Rendering)
│   ├── Plant Options
│   ├── Crop Management
│   ├── Storage Management
│   └── Bank Management
└── Harvest All Button (Floating)
```

### State Management Architecture

#### Primary State Container
- **Location**: App.tsx root component
- **Method**: React useState hook
- **Persistence**: localStorage with automatic save
- **Structure**: Single GameState object containing all game data

#### State Flow Pattern
```
User Interaction → Event Handler → State Update → Component Re-render → UI Update
```

#### State Update Patterns
1. **Functional Updates**: Using callback pattern for state dependencies
2. **Immutable Updates**: Spread operators for nested object updates
3. **Batched Updates**: React automatically batches synchronous updates
4. **Derived State**: Calculated values computed during render

### Data Flow Architecture

#### Unidirectional Data Flow
```
GameState (Source of Truth)
    ↓
Props (Data Distribution)
    ↓
Components (Presentation)
    ↓
Events (User Actions)
    ↓
Handlers (Business Logic)
    ↓
State Updates (Mutations)
    ↓
GameState (Updated Truth)
```

#### Event Handling Pattern
1. **Event Capture**: UI components capture user interactions
2. **Event Bubbling**: Events bubble up to parent handlers
3. **Business Logic**: Handlers contain game rule implementations
4. **State Mutation**: Handlers update central game state
5. **Re-render Cascade**: State changes trigger component updates

### File Organization

#### Source Structure
```
src/
├── components/           # React components
│   ├── GameBoard.tsx    # Grid layout and tile management
│   ├── StatusBar.tsx    # Resource display and farm management
│   ├── Tile.tsx         # Individual tile rendering
│   └── TilePopup.tsx    # Modal interactions
├── types/               # TypeScript definitions
│   └── game.ts          # Game interfaces and constants
├── utils/               # Utility functions
│   ├── gameUtils.ts     # Game logic and calculations
│   ├── storageUtils.ts  # Persistence management
│   └── cacheUtils.ts    # Offline functionality
├── App.tsx              # Root component and state management
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

#### Separation of Concerns
1. **Components**: Pure presentation logic, minimal business logic
2. **Utils**: Reusable functions, calculations, and side effects
3. **Types**: Type definitions, interfaces, and constants
4. **Styles**: Tailwind classes with custom CSS for complex layouts

### State Management Patterns

#### GameState Updates
```typescript
// Functional update pattern for dependent state
setGameState(prev => ({
  ...prev,
  balance: prev.balance - cost,
  tiles: prev.tiles.map(tile => 
    tile.id === targetId ? { ...tile, /* updates */ } : tile
  )
}));
```

#### Derived State Calculations
```typescript
// Computed during render, not stored in state
const maxStorage = calculateMaxStorage(gameState.tiles);
const availablePets = gameState.pets.filter(pet => !pet.employed).length;
const harvestableTiles = gameState.tiles.filter(tile => 
  tile.crop && canHarvest(tile.crop) && !tile.crop.employedPetId
);
```

#### Event Handler Patterns
```typescript
// Callback pattern with dependency injection
const handleAction = useCallback((params) => {
  // Validation logic
  if (!isValidAction(params, gameState)) return;
  
  // State update
  setGameState(prev => updateGameState(prev, params));
}, [gameState]); // Dependencies for memoization
```

### Performance Optimization

#### React Optimization Strategies
1. **useCallback**: Memoize event handlers to prevent unnecessary re-renders
2. **useMemo**: Cache expensive calculations
3. **Component Memoization**: React.memo for pure components (where beneficial)
4. **Key Props**: Stable keys for list rendering optimization

#### Rendering Optimization
1. **Conditional Rendering**: Only render necessary components
2. **Lazy Loading**: Dynamic imports for non-critical components
3. **Virtual Scrolling**: Not needed due to limited grid size
4. **Image Optimization**: External CDN links, no local image processing

#### State Update Optimization
1. **Minimal Updates**: Only update changed properties
2. **Batched Operations**: Group related state changes
3. **Debounced Actions**: Prevent rapid-fire state updates
4. **Efficient Selectors**: Fast lookups using array methods

### Data Persistence

#### localStorage Implementation
```typescript
// Save strategy: Automatic on every state change
useEffect(() => {
  saveGameState(gameState);
}, [gameState]);

// Load strategy: On application initialization
const [gameState, setGameState] = useState<GameState>(() => {
  const saved = loadGameState();
  return saved || generateInitialGameState(5, 10);
});
```

#### Data Validation
1. **Type Checking**: Validate loaded data structure
2. **Fallback Strategy**: Generate new game if data invalid
3. **Migration**: Handle schema changes (future consideration)
4. **Error Recovery**: Graceful handling of corrupted data

### Offline Functionality

#### Application Cache
- **Manifest File**: `game.appcache` for offline resource caching
- **Cache Strategy**: Cache critical assets, network for updates
- **Fallback Pages**: Offline.html for network failures
- **Update Mechanism**: Timestamp-based cache invalidation

#### Service Worker (Future Enhancement)
- **Background Sync**: Sync game state when connection restored
- **Push Notifications**: Harvest ready notifications
- **Update Management**: Seamless app updates
- **Offline Analytics**: Track offline usage patterns

### Error Handling

#### Error Boundaries
```typescript
// Component-level error catching
class GameErrorBoundary extends React.Component {
  // Catch rendering errors and display fallback UI
  // Log errors for debugging
  // Provide recovery options
}
```

#### Graceful Degradation
1. **Network Failures**: Continue with cached data
2. **Storage Failures**: In-memory fallback
3. **Calculation Errors**: Safe defaults and validation
4. **UI Errors**: Partial functionality maintenance

### Security Considerations

#### Client-Side Security
1. **Input Validation**: Validate all user inputs
2. **State Integrity**: Prevent impossible game states
3. **XSS Prevention**: Sanitize any dynamic content
4. **Data Validation**: Verify loaded game data

#### Game Balance Protection
1. **Server Validation**: Future consideration for multiplayer
2. **Checksum Verification**: Detect save file tampering
3. **Rate Limiting**: Prevent automation abuse
4. **Audit Logging**: Track suspicious activities

### Testing Strategy

#### Unit Testing
- **Utils Functions**: Test game calculations and logic
- **Component Logic**: Test component behavior
- **State Management**: Test state update functions
- **Data Persistence**: Test save/load functionality

#### Integration Testing
- **User Flows**: Test complete interaction sequences
- **State Consistency**: Verify state remains valid
- **Performance**: Test with large game states
- **Cross-browser**: Ensure compatibility

#### End-to-End Testing
- **Game Progression**: Test full gameplay loops
- **Offline Functionality**: Test cache behavior
- **Mobile Experience**: Test touch interactions
- **Accessibility**: Test keyboard and screen reader usage

### Deployment Architecture

#### Build Process
1. **Vite Build**: Optimized production bundle
2. **Asset Optimization**: Minification and compression
3. **Cache Busting**: Filename hashing for updates
4. **Bundle Analysis**: Size optimization monitoring

#### Hosting Strategy
- **Static Hosting**: Netlify for simple deployment
- **CDN Distribution**: Global content delivery
- **HTTPS**: Secure connection for all traffic
- **Monitoring**: Performance and error tracking

#### Update Strategy
1. **Versioning**: Semantic versioning for releases
2. **Rollback**: Quick revert capability
3. **Feature Flags**: Gradual feature rollouts
4. **A/B Testing**: Game balance experimentation