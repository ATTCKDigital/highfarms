// Game constants
export const CONSTANTS = {
  // Starting values
  STARTING_BALANCE: 100,
  INITIAL_MAX_BALANCE: 1000,
  INITIAL_MAX_HEMP: 1000,
  
  // Grid settings
  INITIAL_GRID_COLS: 5,
  INITIAL_GRID_ROWS: 3,
  TILES_PER_LEVEL: 15,
  
  // Crop settings
  CROP_COST: 100,
  CROP_COST_MULTIPLIER: 1.5, // 50% increase
  BASE_HARVEST_TIME: 60000, // 60 seconds
  MIN_HARVEST_TIME: 10000, // 10 seconds
  LEVEL_HARVEST_REDUCTION: 0.1, // 10% reduction per level
  HEMP_PER_HARVEST: 10,
  HEMP_SELL_AMOUNT: 100, // Amount of HEMP per sale
  HEMP_SELL_PRICE: 10, // Price per sale ($10 for 100 HEMP)
  
  // Level up settings
  BASE_LEVEL_UP_COST: 100,
  LEVEL_COST_MULTIPLIER: 1.5,
  MAX_CROP_LEVEL: 10,
  
  // Pet settings
  PET_HARVEST_BONUS: 0.1, // 10% faster harvesting
  
  // Storage settings
  STORAGE_FACILITY_COST: 1000,
  BASE_STORAGE_CAPACITY: 1000,
  STORAGE_LEVEL_MULTIPLIER: 2,
  STORAGE_LEVEL_UP_COST: 2000,
  STORAGE_LEVEL_COST_MULTIPLIER: 2,
  MAX_STORAGE_LEVEL: 5,
  STORAGE_BUILD_TIME: 180000, // 3 minutes
  STORAGE_UPGRADE_TIME_INCREASE: 1.5,
  
  // Bank settings
  BANK_FACILITY_COST: 1000,
  BANK_CAPACITY_INCREASE: 500,
  BANK_LEVEL_INCREASE: 0.2,
  BANK_LEVEL_COST_INCREASE: 0.5,
  BANK_BUILD_TIME: 180000,
  BANK_UPGRADE_TIME_INCREASE: 0.75,
  INITIAL_MAX_BANK_LEVEL: 5,
  
  // Farm level settings
  INITIAL_FARM_LEVEL_UP_COST_MONEY: 5000,
  INITIAL_FARM_LEVEL_UP_COST_HEMP: 1000,
  FARM_LEVEL_COST_MULTIPLIER: 2
} as const;

// Interfaces
export interface Crop {
  level: number;
  plantedAt: number;
  lastHarvestedAt: number;
  harvestDuration: number;
  employedPetId?: string;
}

export interface StorageFacility {
  level: number;
  buildStartedAt: number;
  buildDuration: number;
  upgrading: boolean;
}

export interface Bank {
  level: number;
  buildStartedAt: number;
  buildDuration: number;
  upgrading: boolean;
}

export interface Pet {
  id: string;
  name: string;
  employed: boolean;
  employedTileId?: string;
}

export interface Tile {
  id: string;
  type: 'empty' | 'crop' | 'storage' | 'bank';
  x: number;
  y: number;
  crop?: Crop;
  storage?: StorageFacility;
  bank?: Bank;
}

export interface GameState {
  tiles: Tile[];
  width: number;
  height: number;
  balance: number;
  maxBalance: number;
  hemp: number;
  pets: Pet[];
  lastCropCost: number;
  startedAt: number;
  maxStorage: number;
  farmLevel: number;
  levelUpCost: {
    money: number;
    hemp: number;
  };
}