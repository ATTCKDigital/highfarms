import { getGameStartTimestamp, updateCacheManifest } from './cacheUtils';
import { GameState, Tile, Crop, Pet, StorageFacility, Bank, CONSTANTS } from '../types/game';

export function canHarvest(crop: Crop): boolean {
  const now = Date.now();
  const elapsed = now - crop.lastHarvestedAt;
  return elapsed >= crop.harvestDuration;
}

export function getHarvestProgress(crop: Crop): number {
  const now = Date.now();
  const elapsed = now - crop.lastHarvestedAt;
  return Math.min(1, elapsed / crop.harvestDuration);
}

export function calculateHarvestDuration(level: number, hasPet: boolean): number {
  const baseTime = CONSTANTS.BASE_HARVEST_TIME;
  const levelReduction = (level - 1) * CONSTANTS.LEVEL_HARVEST_REDUCTION;
  const petBonus = hasPet ? CONSTANTS.PET_HARVEST_BONUS : 0;
  return Math.max(baseTime * (1 - levelReduction - petBonus), CONSTANTS.MIN_HARVEST_TIME);
}

export function calculateLevelUpCost(currentLevel: number): number {
  return Math.floor(CONSTANTS.BASE_LEVEL_UP_COST * Math.pow(CONSTANTS.LEVEL_COST_MULTIPLIER, currentLevel - 1));
}

export function calculateNextCropCost(lastCost: number): number {
  return Math.floor(lastCost * CONSTANTS.CROP_COST_MULTIPLIER);
}

export function calculateMaxStorage(tiles: Tile[]): number {
  return tiles.reduce((total, tile) => {
    if (tile.type === 'storage' && tile.storage && isStorageComplete(tile.storage)) {
      return total + (CONSTANTS.BASE_STORAGE_CAPACITY * Math.pow(CONSTANTS.STORAGE_LEVEL_MULTIPLIER, tile.storage.level - 1));
    }
    return total;
  }, CONSTANTS.INITIAL_MAX_HEMP);
}

export function calculateMaxBalance(tiles: Tile[]): number {
  return tiles.reduce((total, tile) => {
    if (tile.type === 'bank' && tile.bank && isBankComplete(tile.bank)) {
      return total + (CONSTANTS.BANK_CAPACITY_INCREASE * Math.pow(1 + CONSTANTS.BANK_LEVEL_INCREASE, tile.bank.level - 1));
    }
    return total;
  }, CONSTANTS.INITIAL_MAX_BALANCE);
}

export function calculateStorageBuildTime(isUpgrade: boolean): number {
  return isUpgrade ? CONSTANTS.STORAGE_BUILD_TIME * CONSTANTS.STORAGE_UPGRADE_TIME_INCREASE : CONSTANTS.STORAGE_BUILD_TIME;
}

export function isStorageComplete(storage: StorageFacility): boolean {
  const now = Date.now();
  return now - storage.buildStartedAt >= storage.buildDuration;
}

export function getStorageBuildProgress(storage: StorageFacility): number {
  const now = Date.now();
  const elapsed = now - storage.buildStartedAt;
  return Math.min(1, elapsed / storage.buildDuration);
}

export function calculateStorageLevelUpCost(currentLevel: number): number {
  return Math.floor(CONSTANTS.STORAGE_LEVEL_UP_COST * Math.pow(CONSTANTS.STORAGE_LEVEL_COST_MULTIPLIER, currentLevel - 1));
}

export function isBankComplete(bank: Bank): boolean {
  const now = Date.now();
  return now - bank.buildStartedAt >= bank.buildDuration;
}

export function getBankBuildProgress(bank: Bank): number {
  const now = Date.now();
  const elapsed = now - bank.buildStartedAt;
  return Math.min(1, elapsed / bank.buildDuration);
}

export function calculateNextFarmLevelCost(currentLevel: number): { money: number; hemp: number } {
  return {
    money: Math.floor(CONSTANTS.INITIAL_FARM_LEVEL_UP_COST_MONEY * Math.pow(CONSTANTS.FARM_LEVEL_COST_MULTIPLIER, currentLevel - 1)),
    hemp: Math.floor(CONSTANTS.INITIAL_FARM_LEVEL_UP_COST_HEMP * Math.pow(CONSTANTS.FARM_LEVEL_COST_MULTIPLIER, currentLevel - 1))
  };
}

export function getAvailablePet(pets: Pet[]): Pet | undefined {
  return pets.find(pet => !pet.employed);
}

export function getPetForTile(pets: Pet[], tileId: string): Pet | undefined {
  return pets.find(pet => pet.employed && pet.employedTileId === tileId);
}

export function generateNewTilesForLevel(existingTiles: Tile[], newLevel: number): Tile[] {
  const tilesNeeded = newLevel * CONSTANTS.TILES_PER_LEVEL;
  const currentTiles = existingTiles.length;
  const tilesToAdd = tilesNeeded - currentTiles;
  
  if (tilesToAdd <= 0) return existingTiles;

  const newTiles = [...existingTiles];
  const generateId = (x: number, y: number) => `tile-${x}-${y}`;

  for (let i = 0; i < tilesToAdd; i++) {
    const position = currentTiles + i;
    const y = Math.floor(position / CONSTANTS.INITIAL_GRID_COLS);
    const x = position % CONSTANTS.INITIAL_GRID_COLS;

    newTiles.push({
      id: generateId(x, y),
      type: 'empty',
      x,
      y
    });
  }

  return newTiles;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(Math.floor(num));
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export function generateInitialGameState(width: number, height: number): GameState {
  const tiles: Tile[] = [];
  const generateId = (x: number, y: number) => `tile-${x}-${y}`;

  // Generate initial grid (3x5 = 15 tiles for Farm level 1)
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 5; x++) {
      tiles.push({
        id: generateId(x, y),
        type: 'empty',
        x,
        y
      });
    }
  }

  const initialPet: Pet = {
    id: 'pet-1',
    name: 'High Pet',
    employed: false
  };

  const startedAt = getGameStartTimestamp();
  updateCacheManifest(startedAt);

  const initialLevelUpCost = {
    money: CONSTANTS.INITIAL_FARM_LEVEL_UP_COST_MONEY,
    hemp: CONSTANTS.INITIAL_FARM_LEVEL_UP_COST_HEMP
  };

  return {
    tiles,
    width: 5,
    height: 3,
    balance: CONSTANTS.STARTING_BALANCE,
    maxBalance: CONSTANTS.INITIAL_MAX_BALANCE,
    hemp: 0,
    pets: [initialPet],
    lastCropCost: CONSTANTS.CROP_COST,
    startedAt,
    maxStorage: CONSTANTS.INITIAL_MAX_HEMP,
    farmLevel: 1,
    levelUpCost: initialLevelUpCost
  };
}