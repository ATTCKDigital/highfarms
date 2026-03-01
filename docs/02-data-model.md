# Hemp Farm Game - Data Model Specification

## Core Data Structures

### GameState Interface
```typescript
interface GameState {
  tiles: Tile[];           // Grid of game tiles
  width: number;           // Grid width (always 5)
  height: number;          // Grid height (expands with farm level)
  balance: number;         // Current money
  maxBalance: number;      // Maximum money capacity
  hemp: number;            // Current hemp inventory
  pets: Pet[];             // Available pets
  lastCropCost: number;    // Cost for next crop (increases each plant)
  startedAt: number;       // Game start timestamp
  maxStorage: number;      // Maximum hemp storage capacity
  farmLevel: number;       // Current farm level
  levelUpCost: {           // Requirements for next farm level
    money: number;
    hemp: number;
  };
}
```

### Tile Interface
```typescript
interface Tile {
  id: string;                    // Unique identifier (format: "tile-x-y")
  type: 'empty' | 'crop' | 'storage' | 'bank';
  x: number;                     // Grid X coordinate (0-4)
  y: number;                     // Grid Y coordinate (0+)
  crop?: Crop;                   // Crop data if type is 'crop'
  storage?: StorageFacility;     // Storage data if type is 'storage'
  bank?: Bank;                   // Bank data if type is 'bank'
}
```

### Crop Interface
```typescript
interface Crop {
  level: number;           // Crop level (1-10)
  plantedAt: number;       // Timestamp when planted
  lastHarvestedAt: number; // Timestamp of last harvest
  harvestDuration: number; // Time between harvests (ms)
  employedPetId?: string;  // ID of assigned pet (optional)
}
```

### StorageFacility Interface
```typescript
interface StorageFacility {
  level: number;           // Storage level (1-5)
  buildStartedAt: number;  // Construction start timestamp
  buildDuration: number;   // Construction time (ms)
  upgrading: boolean;      // Whether currently upgrading
}
```

### Bank Interface
```typescript
interface Bank {
  level: number;           // Bank level (1-5)
  buildStartedAt: number;  // Construction start timestamp
  buildDuration: number;   // Construction time (ms)
  upgrading: boolean;      // Whether currently upgrading
}
```

### Pet Interface
```typescript
interface Pet {
  id: string;              // Unique identifier
  name: string;            // Pet display name
  employed: boolean;       // Whether assigned to a tile
  employedTileId?: string; // ID of assigned tile (optional)
}
```

## Game Constants
All game balance values are defined in `CONSTANTS` object:

### Economic Values
- `STARTING_BALANCE`: 100 (initial money)
- `CROP_COST`: 100 (base crop cost)
- `CROP_COST_MULTIPLIER`: 1.5 (cost increase per plant)
- `HEMP_SELL_AMOUNT`: 100 (hemp per sale transaction)
- `HEMP_SELL_PRICE`: 10 (money per sale)

### Timing Values
- `BASE_HARVEST_TIME`: 60000ms (1 minute base harvest)
- `MIN_HARVEST_TIME`: 10000ms (minimum harvest time)
- `STORAGE_BUILD_TIME`: 180000ms (3 minutes construction)

### Capacity Values
- `INITIAL_MAX_HEMP`: 1000 (starting hemp storage)
- `INITIAL_MAX_BALANCE`: 1000 (starting money capacity)
- `BASE_STORAGE_CAPACITY`: 1000 (storage facility capacity)

### Level Progression
- `MAX_CROP_LEVEL`: 10
- `MAX_STORAGE_LEVEL`: 5
- `LEVEL_COST_MULTIPLIER`: 1.5 (exponential cost scaling)

## Data Persistence
- **Storage Method**: localStorage
- **Storage Key**: 'hemp_farm_save'
- **Auto-save**: Triggered on every state change
- **Data Validation**: Type checking on load with fallback to new game
- **Cache Management**: Application cache manifest for offline play