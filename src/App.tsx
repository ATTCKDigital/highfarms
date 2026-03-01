import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GameBoard } from './components/GameBoard';
import { StatusBar } from './components/StatusBar';
import { TilePopup } from './components/TilePopup';
import { 
  generateInitialGameState, 
  calculateHarvestDuration, 
  calculateLevelUpCost, 
  canHarvest, 
  getAvailablePet, 
  getPetForTile, 
  calculateNextCropCost, 
  calculateMaxStorage, 
  calculateStorageBuildTime, 
  isStorageComplete, 
  calculateStorageLevelUpCost,
  calculateNextFarmLevelCost,
  generateNewTilesForLevel,
  getMaxLevelForFarmLevel,
  calculateMaxBalance
} from './utils/gameUtils';
import { GameState, Tile, CONSTANTS } from './types/game';
import { Tractor } from 'lucide-react';
import { saveGameState, loadGameState } from './utils/storageUtils';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions] = useState({ width: 5, height: 10 });
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameState();
    return saved || generateInitialGameState(5, 10);
  });
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [showPlantConfirm, setShowPlantConfirm] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [tileToMove, setTileToMove] = useState<Tile | null>(null);

  // Calculate derived state
  const availablePets = gameState.pets.filter(pet => !pet.employed).length;
  const totalPets = gameState.pets.length;
  const maxStorage = calculateMaxStorage(gameState.tiles);
  const maxBalance = calculateMaxBalance(gameState.tiles);
  
  // Calculate harvestable tiles, excluding automated ones
  const manuallyHarvestableTiles = gameState.tiles.filter(t => 
    t.crop && 
    canHarvest(t.crop) && 
    !t.crop.employedPetId // Only count tiles without pets
  );
  const manuallyHarvestableTilesCount = manuallyHarvestableTiles.length;

  // Save game state whenever it changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Check for harvestable tiles periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const hasHarvestable = gameState.tiles.some(t => t.crop && canHarvest(t.crop));
      if (hasHarvestable) {
        setGameState(prev => ({ ...prev }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState.tiles]);

  const handleTileClick = useCallback((tileId: string) => {
    const tile = gameState.tiles.find(t => t.id === tileId);
    if (!tile) return;

    if (isMoving && tile.type === 'empty' && tileToMove) {
      // Handle moving tile
      setGameState(prev => ({
        ...prev,
        tiles: prev.tiles.map(t => {
          if (t.id === tile.id) {
            return {
              ...t,
              type: tileToMove.type,
              crop: tileToMove.crop,
              storage: tileToMove.storage,
              bank: tileToMove.bank
            };
          }
          if (t.id === tileToMove.id) {
            return {
              ...t,
              type: 'empty',
              crop: undefined,
              storage: undefined,
              bank: undefined
            };
          }
          return t;
        })
      }));
      setIsMoving(false);
      setTileToMove(null);
      setSelectedTile(null);
      return;
    }

    if (tile.type === 'empty') {
      setSelectedTile(tile);
      setShowPlantConfirm(true);
    } else if (tile.type === 'crop' || tile.type === 'storage' || tile.type === 'bank') {
      setSelectedTile(tile);
      setShowPlantConfirm(false);
    }
  }, [gameState.tiles, isMoving, tileToMove]);

  const handlePlantCrop = useCallback(() => {
    if (!selectedTile || gameState.balance < gameState.lastCropCost) return;

    const nextCropCost = calculateNextCropCost(gameState.lastCropCost);

    setGameState(prev => ({
      ...prev,
      balance: prev.balance - prev.lastCropCost,
      lastCropCost: nextCropCost,
      tiles: prev.tiles.map(t => 
        t.id === selectedTile.id ? {
          ...t,
          type: 'crop',
          crop: {
            level: 1,
            plantedAt: Date.now(),
            lastHarvestedAt: Date.now(),
            harvestDuration: calculateHarvestDuration(1, false)
          }
        } : t
      )
    }));
    setSelectedTile(null);
    setShowPlantConfirm(false);
  }, [selectedTile, gameState.balance, gameState.lastCropCost]);

  const handleBuildStorage = useCallback(() => {
    if (!selectedTile || gameState.balance < CONSTANTS.STORAGE_FACILITY_COST) return;

    setGameState(prev => ({
      ...prev,
      balance: prev.balance - CONSTANTS.STORAGE_FACILITY_COST,
      tiles: prev.tiles.map(t => 
        t.id === selectedTile.id ? {
          ...t,
          type: 'storage',
          storage: {
            level: 1,
            buildStartedAt: Date.now(),
            buildDuration: calculateStorageBuildTime(false),
            upgrading: false
          }
        } : t
      )
    }));
    setSelectedTile(null);
    setShowPlantConfirm(false);
  }, [selectedTile, gameState.balance]);

  const handleBuildBank = useCallback(() => {
    if (!selectedTile || gameState.balance < CONSTANTS.BANK_FACILITY_COST) return;

    // Count existing banks
    const bankCount = gameState.tiles.filter(t => t.type === 'bank').length;
    if (bankCount >= gameState.farmLevel) {
      return; // Can't build more banks than current farm level
    }

    setGameState(prev => ({
      ...prev,
      balance: prev.balance - CONSTANTS.BANK_FACILITY_COST,
      tiles: prev.tiles.map(t => 
        t.id === selectedTile.id ? {
          ...t,
          type: 'bank',
          bank: {
            level: 1,
            buildStartedAt: Date.now(),
            buildDuration: calculateStorageBuildTime(false),
            upgrading: false
          }
        } : t
      )
    }));
    setSelectedTile(null);
    setShowPlantConfirm(false);
  }, [selectedTile, gameState.balance, gameState.farmLevel, gameState.tiles]);

  const handleUpgradeStorage = useCallback(() => {
    if (!selectedTile?.storage || !isStorageComplete(selectedTile.storage)) return;

    const levelUpCost = calculateStorageLevelUpCost(selectedTile.storage.level);
    if (gameState.balance >= levelUpCost && selectedTile.storage.level < CONSTANTS.MAX_STORAGE_LEVEL) {
      setGameState(prev => ({
        ...prev,
        balance: prev.balance - levelUpCost,
        tiles: prev.tiles.map(t => 
          t.id === selectedTile.id ? {
            ...t,
            storage: {
              ...t.storage!,
              level: t.storage!.level + 1,
              buildStartedAt: Date.now(),
              buildDuration: calculateStorageBuildTime(true),
              upgrading: true
            }
          } : t
        )
      }));
      setSelectedTile(null);
    }
  }, [selectedTile, gameState.balance]);

  const handleLevelUp = useCallback(() => {
    if (!selectedTile?.crop) return;

    const cost = calculateLevelUpCost(selectedTile.crop.level);
    if (gameState.balance >= cost && selectedTile.crop.level < CONSTANTS.MAX_CROP_LEVEL) {
      setGameState(prev => ({
        ...prev,
        balance: prev.balance - cost,
        tiles: prev.tiles.map(t => 
          t.id === selectedTile.id ? {
            ...t,
            crop: {
              ...t.crop!,
              level: t.crop!.level + 1,
              harvestDuration: calculateHarvestDuration(t.crop!.level + 1, !!t.crop!.employedPetId)
            }
          } : t
        )
      }));
    }
  }, [selectedTile, gameState.balance]);

  const handleHarvest = useCallback((tileId: string) => {
    const tile = gameState.tiles.find(t => t.id === tileId);
    if (!tile?.crop || !canHarvest(tile.crop)) return;

    const hempGained = CONSTANTS.HEMP_PER_HARVEST * tile.crop.level;
    const newHempAmount = gameState.hemp + hempGained;

    // Only harvest if we have storage space
    if (newHempAmount > maxStorage) return;

    setGameState(prev => ({
      ...prev,
      hemp: newHempAmount,
      tiles: prev.tiles.map(t => 
        t.id === tileId ? {
          ...t,
          crop: {
            ...t.crop!,
            lastHarvestedAt: Date.now()
          }
        } : t
      )
    }));
    
    setSelectedTile(null);
  }, [gameState.tiles, gameState.hemp, maxStorage]);

  const handleHarvestAll = useCallback(() => {
    // Only harvest non-automated tiles
    const harvestableTiles = gameState.tiles.filter(t => 
      t.crop && 
      canHarvest(t.crop) && 
      !t.crop.employedPetId
    );
    
    if (harvestableTiles.length === 0) return;

    const totalHempGained = harvestableTiles.reduce((total, tile) => 
      total + (CONSTANTS.HEMP_PER_HARVEST * tile.crop!.level), 0);

    // Only harvest if we have storage space
    const newHempAmount = gameState.hemp + totalHempGained;
    if (newHempAmount > maxStorage) return;

    setGameState(prev => ({
      ...prev,
      hemp: newHempAmount,
      tiles: prev.tiles.map(t => 
        (t.crop && canHarvest(t.crop) && !t.crop.employedPetId) ? {
          ...t,
          crop: {
            ...t.crop,
            lastHarvestedAt: Date.now()
          }
        } : t
      )
    }));
  }, [gameState.tiles, gameState.hemp, maxStorage]);

  const handleEmployPet = useCallback(() => {
    if (!selectedTile?.crop) return;
    
    const availablePet = getAvailablePet(gameState.pets);
    if (!availablePet) return;

    setGameState(prev => ({
      ...prev,
      pets: prev.pets.map(pet => 
        pet.id === availablePet.id ? {
          ...pet,
          employed: true,
          employedTileId: selectedTile.id
        } : pet
      ),
      tiles: prev.tiles.map(t => 
        t.id === selectedTile.id ? {
          ...t,
          crop: {
            ...t.crop!,
            employedPetId: availablePet.id,
            harvestDuration: calculateHarvestDuration(t.crop!.level, true)
          }
        } : t
      )
    }));
  }, [selectedTile, gameState.pets]);

  const handleRemovePet = useCallback(() => {
    if (!selectedTile?.crop?.employedPetId) return;

    setGameState(prev => ({
      ...prev,
      pets: prev.pets.map(pet => 
        pet.id === selectedTile.crop!.employedPetId ? {
          ...pet,
          employed: false,
          employedTileId: undefined
        } : pet
      ),
      tiles: prev.tiles.map(t => 
        t.id === selectedTile.id ? {
          ...t,
          crop: {
            ...t.crop!,
            employedPetId: undefined,
            harvestDuration: calculateHarvestDuration(t.crop!.level, false)
          }
        } : t
      )
    }));
  }, [selectedTile]);

  const handleSellHemp = useCallback((amount: number) => {
    const hempsToSell = Math.floor(amount / CONSTANTS.HEMP_SELL_AMOUNT);
    const moneyGained = hempsToSell * CONSTANTS.HEMP_SELL_PRICE;
    const hempSold = hempsToSell * CONSTANTS.HEMP_SELL_AMOUNT;

    setGameState(prev => ({
      ...prev,
      hemp: prev.hemp - hempSold,
      balance: prev.balance + moneyGained
    }));
  }, []);

  const handleBonusReward = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      balance: prev.balance + 50
    }));
  }, []);

  const handleFarmLevelUp = useCallback(() => {
    const nextLevelCost = calculateNextFarmLevelCost(gameState.farmLevel);
    
    if (gameState.balance >= nextLevelCost.money && gameState.hemp >= nextLevelCost.hemp) {
      setGameState(prev => {
        const newLevel = prev.farmLevel + 1;
        const newTiles = generateNewTilesForLevel(prev.tiles, newLevel);
        
        return {
          ...prev,
          farmLevel: newLevel,
          balance: prev.balance - nextLevelCost.money,
          hemp: prev.hemp - nextLevelCost.hemp,
          levelUpCost: calculateNextFarmLevelCost(newLevel),
          tiles: newTiles,
          height: prev.height + Math.floor(CONSTANTS.TILES_PER_LEVEL / CONSTANTS.INITIAL_GRID_COLS)
        };
      });
    }
  }, [gameState.farmLevel, gameState.balance, gameState.hemp]);

  const handleMove = useCallback(() => {
    if (!selectedTile) return;
    setIsMoving(true);
    setTileToMove(selectedTile);
  }, [selectedTile]);

  const handleCancelMove = useCallback(() => {
    setIsMoving(false);
    setTileToMove(null);
    setSelectedTile(null);
  }, []);

  return (
    <div 
      className="h-screen w-screen flex flex-col relative"
      style={{
        backgroundImage: 'url(https://attck.com/wp-content/uploads/dnicenyc_I_need_a_cartoonish_background_of_an_overhead_view_of__23cde8a6-e3cc-41f4-ac7c-f9ca0c3dd5ba.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col h-full">
        <StatusBar 
          balance={gameState.balance} 
          hemp={gameState.hemp} 
          availablePets={availablePets}
          totalPets={totalPets}
          startedAt={gameState.startedAt}
          onSellHemp={handleSellHemp}
          onBonusReward={handleBonusReward}
          farmLevel={gameState.farmLevel}
          onFarmLevelUp={handleFarmLevelUp}
          maxBalance={maxBalance}
        />
        
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto"
        >
          <GameBoard 
            gameState={gameState} 
            containerRef={containerRef}
            onTileClick={handleTileClick}
            onTileHarvest={handleHarvest}
            isMoving={isMoving}
          />

          {manuallyHarvestableTilesCount > 0 && (
            <button
              onClick={handleHarvestAll}
              className="
                fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full
                flex items-center gap-2 text-white cursor-pointer
                transition-all z-20 shadow-[0_4px_14px_0_rgba(0,0,0,0.25)]
                hover:scale-105
              "
              style={{
                backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-1.00.59%E2%80%AFPM.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <Tractor className="w-5 h-5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
              <span className="font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                Harvest All ({manuallyHarvestableTilesCount})
              </span>
            </button>
          )}
        </div>

        {selectedTile && (showPlantConfirm ? (
          <TilePopup
            tile={selectedTile}
            onClose={() => {
              setSelectedTile(null);
              setShowPlantConfirm(false);
            }}
            onPlant={handlePlantCrop}
            onBuildStorage={handleBuildStorage}
            onBuildBank={handleBuildBank}
            balance={gameState.balance}
            mode="plant"
            hasPet={false}
            canEmployPet={false}
            cropCost={gameState.lastCropCost}
            maxStorage={maxStorage}
            maxBalance={maxBalance}
          />
        ) : (
          <TilePopup
            tile={selectedTile}
            onClose={() => setSelectedTile(null)}
            onLevelUp={handleLevelUp}
            onHarvest={() => handleHarvest(selectedTile.id)}
            onEmployPet={handleEmployPet}
            onRemovePet={handleRemovePet}
            onUpgradeStorage={handleUpgradeStorage}
            onMove={handleMove}
            onCancelMove={handleCancelMove}
            balance={gameState.balance}
            mode={selectedTile.type === 'storage' ? 'storage' : selectedTile.type === 'bank' ? 'bank' : 'manage'}
            hasPet={!!selectedTile.crop?.employedPetId}
            canEmployPet={availablePets > 0}
            cropCost={gameState.lastCropCost}
            maxStorage={maxStorage}
            maxBalance={maxBalance}
            isMoving={isMoving}
          />
        ))}
      </div>
    </div>
  );
}