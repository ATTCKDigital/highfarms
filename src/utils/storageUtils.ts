import { GameState } from '../types/game';

const STORAGE_KEY = 'hemp_farm_save';
const CACHE_KEYS = ['hemp_farm_save', 'game_start_timestamp'];

export function clearGameState(): void {
  // Clear all game-related storage keys
  CACHE_KEYS.forEach(key => localStorage.removeItem(key));
  
  // Clear application cache if available
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
}

export function saveGameState(gameState: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadGameState(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const parsed = JSON.parse(saved);
    
    // Validate the loaded data has required fields
    if (
      typeof parsed === 'object' &&
      Array.isArray(parsed.tiles) &&
      typeof parsed.width === 'number' &&
      typeof parsed.height === 'number' &&
      typeof parsed.balance === 'number' &&
      typeof parsed.hemp === 'number' &&
      Array.isArray(parsed.pets) &&
      typeof parsed.lastCropCost === 'number' &&
      typeof parsed.startedAt === 'number'
    ) {
      return parsed as GameState;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}