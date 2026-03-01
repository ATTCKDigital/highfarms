# Hemp Farm Game - Constants and Configuration Specification

## Game Balance Constants

### Economic Configuration
```typescript
// Starting values - Initial player resources
STARTING_BALANCE: 100           // Starting money amount
INITIAL_MAX_BALANCE: 1000      // Base money storage capacity
INITIAL_MAX_HEMP: 1000         // Base hemp storage capacity

// Crop economics
CROP_COST: 100                 // Base cost for first crop
CROP_COST_MULTIPLIER: 1.5      // Cost increase per crop planted (50%)
HEMP_PER_HARVEST: 10           // Hemp gained per harvest per crop level
HEMP_SELL_AMOUNT: 100          // Hemp required per sale transaction
HEMP_SELL_PRICE: 10            // Money gained per sale transaction

// Exchange rate calculation: 100 hemp = $10 (10:1 ratio)
```

### Timing Configuration
```typescript
// Harvest timing
BASE_HARVEST_TIME: 60000       // 60 seconds base harvest duration
MIN_HARVEST_TIME: 10000        // 10 seconds minimum harvest time
LEVEL_HARVEST_REDUCTION: 0.1   // 10% time reduction per crop level

// Construction timing
STORAGE_BUILD_TIME: 180000     // 3 minutes (180 seconds)
STORAGE_UPGRADE_TIME_INCREASE: 1.5  // 50% longer for upgrades
BANK_BUILD_TIME: 180000        // 3 minutes base construction
BANK_UPGRADE_TIME_INCREASE: 0.75    // 75% longer for upgrades
```

### Level Progression
```typescript
// Crop progression
MAX_CROP_LEVEL: 10             // Maximum crop level
BASE_LEVEL_UP_COST: 100        // Base cost for crop level 2
LEVEL_COST_MULTIPLIER: 1.5     // Exponential cost scaling

// Building progression
MAX_STORAGE_LEVEL: 5           // Maximum storage facility level
STORAGE_LEVEL_UP_COST: 2000    // Base storage upgrade cost
STORAGE_LEVEL_COST_MULTIPLIER: 2  // Double cost per level

// Farm progression
INITIAL_FARM_LEVEL_UP_COST_MONEY: 5000  // Money for farm level 2
INITIAL_FARM_LEVEL_UP_COST_HEMP: 1000   // Hemp for farm level 2
FARM_LEVEL_COST_MULTIPLIER: 2           // Double cost per farm level
```

### Capacity Configuration
```typescript
// Storage scaling
BASE_STORAGE_CAPACITY: 1000    // Hemp capacity per storage level 1
STORAGE_LEVEL_MULTIPLIER: 2    // Double capacity per level

// Bank scaling
BANK_CAPACITY_INCREASE: 500    // Base money capacity increase
BANK_LEVEL_INCREASE: 0.2       // 20% compound increase per level
INITIAL_MAX_BANK_LEVEL: 5      // Maximum bank level

// Grid scaling
INITIAL_GRID_COLS: 5           // Fixed grid width
INITIAL_GRID_ROWS: 3           // Starting grid height
TILES_PER_LEVEL: 15            // New tiles per farm level
```

### Pet System Configuration
```typescript
// Pet mechanics
PET_HARVEST_BONUS: 0.1         // 10% harvest time reduction
// Note: Pets also provide automatic harvesting
```

### Facility Costs
```typescript
// Building costs
STORAGE_FACILITY_COST: 1000    // Initial storage construction cost
BANK_FACILITY_COST: 1000       // Initial bank construction cost
```

## Calculated Values and Formulas

### Dynamic Cost Calculations
```typescript
// Crop cost progression
// Cost = CROP_COST * (CROP_COST_MULTIPLIER ^ plants_planted)
// Example: $100, $150, $225, $337.50, $506.25...

// Level up cost progression  
// Cost = BASE_LEVEL_UP_COST * (LEVEL_COST_MULTIPLIER ^ (current_level - 1))
// Example: $100, $150, $225, $337.50, $506.25...

// Storage upgrade costs
// Cost = STORAGE_LEVEL_UP_COST * (STORAGE_LEVEL_COST_MULTIPLIER ^ (current_level - 1))
// Example: $2000, $4000, $8000, $16000, $32000

// Farm level up costs
// Money = INITIAL_FARM_LEVEL_UP_COST_MONEY * (FARM_LEVEL_COST_MULTIPLIER ^ (current_level - 1))
// Hemp = INITIAL_FARM_LEVEL_UP_COST_HEMP * (FARM_LEVEL_COST_MULTIPLIER ^ (current_level - 1))
```

### Capacity Calculations
```typescript
// Storage capacity calculation
// Total Hemp Storage = INITIAL_MAX_HEMP + Σ(storage_facilities)
// Per facility = BASE_STORAGE_CAPACITY * (STORAGE_LEVEL_MULTIPLIER ^ (level - 1))

// Bank capacity calculation  
// Total Money Storage = INITIAL_MAX_BALANCE + Σ(bank_facilities)
// Per facility = BANK_CAPACITY_INCREASE * ((1 + BANK_LEVEL_INCREASE) ^ (level - 1))

// Grid size calculation
// Total Tiles = farm_level * TILES_PER_LEVEL
// Grid Height = ceil(total_tiles / INITIAL_GRID_COLS)
```

### Time Calculations
```typescript
// Harvest duration calculation
// Duration = max(
//   BASE_HARVEST_TIME * (1 - (level - 1) * LEVEL_HARVEST_REDUCTION - pet_bonus),
//   MIN_HARVEST_TIME
// )
// Where pet_bonus = PET_HARVEST_BONUS if pet employed, 0 otherwise

// Construction time calculation
// Storage: BASE_TIME * (UPGRADE_MULTIPLIER if upgrading else 1)
// Bank: Similar pattern with different multiplier
```

## Configuration Categories

### Balance Tuning Parameters
These values directly affect game difficulty and progression speed:
- **Economic Multipliers**: Control inflation and resource scarcity
- **Time Constants**: Affect game pacing and player engagement
- **Capacity Limits**: Create strategic pressure points
- **Cost Scaling**: Determine progression curve steepness

### Technical Configuration
```typescript
// UI and UX constants
GRID_ASPECT_RATIO: 1           // Square tiles
MAX_GRID_WIDTH: 600            // Pixels, responsive design limit
ANIMATION_DURATION: 200        // Milliseconds for transitions
PROGRESS_UPDATE_INTERVAL: 1000 // Milliseconds between progress updates

// Storage and persistence
STORAGE_KEY: 'hemp_farm_save'  // localStorage key
CACHE_VERSION_KEY: 'game_start_timestamp'  // Cache management
AUTO_SAVE_ENABLED: true        // Automatic state persistence
```

### Visual Configuration
```typescript
// Asset configuration
EMPTY_TILE_VARIANTS: 4         // Number of soil texture variations
PET_IMAGE_VARIANTS: 10         // Number of pet appearance variations
BUILDING_LEVEL_VARIANTS: 4     // Different building appearance levels

// Color and styling
PRIMARY_COLORS: {
  money: '#f59e0b',           // Yellow for money/gold
  hemp: '#10b981',            // Green for hemp/nature
  building: '#3b82f6',        // Blue for technology/buildings
  warning: '#ef4444',         // Red for warnings/errors
  success: '#10b981'          // Green for success states
}
```

## Environment-Specific Configuration

### Development Configuration
```typescript
// Debug and development features
DEBUG_MODE: false              // Enable debug logging
FAST_TIMERS: false            // Accelerated timers for testing
UNLIMITED_RESOURCES: false     // Bypass resource constraints
SHOW_TILE_COORDINATES: false   // Display tile position info
```

### Production Configuration
```typescript
// Performance and optimization
ENABLE_ANALYTICS: true         // User behavior tracking
CACHE_ASSETS: true            // Browser caching strategy
COMPRESS_SAVE_DATA: false     // Save file compression
ERROR_REPORTING: true         // Crash and error reporting
```

### Feature Flags
```typescript
// Experimental or optional features
ENABLE_SOUND: false           // Audio system (not implemented)
ENABLE_ACHIEVEMENTS: false    // Achievement system (future)
ENABLE_MULTIPLAYER: false     // Multiplayer features (future)
ENABLE_SEASONAL_EVENTS: false // Time-based events (future)
```

## Validation and Constraints

### Input Validation Rules
```typescript
// Numeric constraints
MIN_FARM_LEVEL: 1             // Cannot go below level 1
MAX_FARM_LEVEL: 100           // Practical upper limit
MIN_CROP_LEVEL: 1             // Crops start at level 1
MIN_BUILDING_LEVEL: 1         // Buildings start at level 1

// Grid constraints
MIN_GRID_SIZE: 15             // Minimum playable area
MAX_GRID_SIZE: 1500           // Practical upper limit (100 levels)
FIXED_GRID_WIDTH: 5           // Always 5 columns

// Resource constraints
MIN_BALANCE: 0                // Cannot have negative money
MIN_HEMP: 0                   // Cannot have negative hemp
MAX_SAFE_INTEGER: 2^53-1      // JavaScript number limit
```

### Business Logic Constraints
```typescript
// Game rule enforcement
MAX_BANKS_PER_FARM_LEVEL: 1   // One bank per farm level
PETS_PER_TILE_LIMIT: 1        // One pet per crop tile
BUILDINGS_PER_TILE_LIMIT: 1   // One building per tile
CROPS_PER_TILE_LIMIT: 1       // One crop per tile

// Progression gates
REQUIRE_MONEY_FOR_CROPS: true      // Must have money to plant
REQUIRE_STORAGE_FOR_HEMP: true     // Hemp capped by storage
REQUIRE_BANKS_FOR_MONEY: true      // Money capped by banks
REQUIRE_RESOURCES_FOR_UPGRADES: true // Must afford upgrades
```

## Configuration Management

### Runtime Configuration
```typescript
// Values that can be modified during gameplay
interface RuntimeConfig {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  autoSaveInterval: number;
  notificationsEnabled: boolean;
}
```

### Static Configuration
```typescript
// Values that are fixed for the game session
interface StaticConfig {
  gameVersion: string;
  buildTimestamp: number;
  featureFlags: FeatureFlags;
  balanceConstants: typeof CONSTANTS;
}
```

### Configuration Loading
```typescript
// Configuration initialization order
1. Load default constants from CONSTANTS object
2. Apply environment-specific overrides
3. Load user preferences from localStorage
4. Validate all configuration values
5. Initialize game state with validated config
```

This configuration system provides:
- **Centralized Balance Control**: All game balance in one location
- **Easy Tuning**: Modify values to adjust difficulty
- **Feature Management**: Enable/disable features via flags
- **Environment Flexibility**: Different settings for dev/prod
- **Validation**: Ensure all values are within acceptable ranges
- **Documentation**: Clear understanding of each parameter's purpose