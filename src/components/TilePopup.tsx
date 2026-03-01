import React, { useEffect, useCallback } from 'react';
import { X, Dog, Warehouse, Move, Building2 } from 'lucide-react';
import { Tile, Crop, CONSTANTS } from '../types/game';
import { 
  calculateLevelUpCost, 
  calculateStorageLevelUpCost, 
  formatDateTime, 
  formatDuration, 
  formatNumber, 
  isStorageComplete,
  canHarvest 
} from '../utils/gameUtils';

interface TilePopupProps {
  tile: Tile;
  onClose: () => void;
  onLevelUp?: () => void;
  onHarvest?: () => void;
  onPlant?: () => void;
  onBuildStorage?: () => void;
  onUpgradeStorage?: () => void;
  onEmployPet?: () => void;
  onRemovePet?: () => void;
  onMove?: () => void;
  onCancelMove?: () => void;
  onBuildBank?: () => void;
  onUpgradeBank?: () => void;
  balance: number;
  mode: 'plant' | 'manage' | 'storage' | 'bank';
  hasPet: boolean;
  canEmployPet: boolean;
  cropCost: number;
  maxStorage: number;
  maxBalance: number;
  isMoving?: boolean;
}

export function TilePopup({ 
  tile, 
  onClose, 
  onLevelUp, 
  onHarvest, 
  onPlant,
  onBuildStorage,
  onUpgradeStorage,
  onEmployPet,
  onRemovePet,
  onMove,
  onCancelMove,
  onBuildBank,
  onUpgradeBank,
  balance, 
  mode,
  hasPet,
  canEmployPet,
  cropCost,
  maxStorage,
  maxBalance,
  isMoving = false
}: TilePopupProps) {
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleEscapeKey]);

  const handleLevelUp = () => {
    onLevelUp?.();
    onClose();
  };

  if (mode === 'plant') {
    const canAffordCrop = balance >= cropCost;
    const canAffordStorage = balance >= CONSTANTS.STORAGE_FACILITY_COST;
    const canAffordBank = balance >= CONSTANTS.BANK_FACILITY_COST;

    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20" onClick={handleBackdropClick}>
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Build Options</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2">Plant a Crop</h3>
              <p className="text-gray-600 mb-3">
                Cost: ${cropCost}
              </p>
              <button
                onClick={onPlant}
                disabled={!canAffordCrop}
                className={`
                  w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)]
                  ${canAffordCrop ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}
                  transition-opacity
                `}
                style={{
                  backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-3.20.12%E2%80%AFPM.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                Plant Crop
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2">Build Storage Facility</h3>
              <p className="text-gray-600 mb-3">
                Cost: ${CONSTANTS.STORAGE_FACILITY_COST}
                <br />
                Current Storage: {formatNumber(maxStorage)} HEMP
              </p>
              <button
                onClick={onBuildStorage}
                disabled={!canAffordStorage}
                className={`
                  w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)]
                  ${canAffordStorage ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}
                  transition-opacity flex items-center justify-center gap-2
                `}
                style={{
                  backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-3.20.12%E2%80%AFPM.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <Warehouse className="w-5 h-5" />
                Build Storage
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2">Build Bank</h3>
              <p className="text-gray-600 mb-3">
                Cost: ${CONSTANTS.BANK_FACILITY_COST}
                <br />
                Current Balance Capacity: ${formatNumber(maxBalance)}
              </p>
              <button
                onClick={onBuildBank}
                disabled={!canAffordBank}
                className={`
                  w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)]
                  ${canAffordBank ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}
                  transition-opacity flex items-center justify-center gap-2
                `}
                style={{
                  backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-3.20.12%E2%80%AFPM.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <Building2 className="w-5 h-5" />
                Build Bank
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'storage' && tile.storage) {
    const levelUpCost = calculateStorageLevelUpCost(tile.storage.level);
    const canAffordUpgrade = balance >= levelUpCost;
    const isMaxLevel = tile.storage.level >= CONSTANTS.MAX_STORAGE_LEVEL;
    const isUpgrading = tile.storage.upgrading;
    const isBuilding = !isStorageComplete(tile.storage);

    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20" onClick={handleBackdropClick}>
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Lv{tile.storage.level} Storage Facility</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <p>Built: {formatDateTime(tile.storage.buildStartedAt)}</p>
              <p>Time since construction: {formatDuration(Date.now() - tile.storage.buildStartedAt)}</p>
            </div>

            {isMoving ? (
              <button
                onClick={onCancelMove}
                className="w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 bg-red-500"
              >
                Cancel Move
              </button>
            ) : (
              <button
                onClick={onMove}
                className="w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{
                  backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-3.20.12%E2%80%AFPM.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <Move className="w-5 h-5" />
                Move Storage
              </button>
            )}

            {isBuilding ? (
              <p className="text-blue-500 text-center">Construction in progress...</p>
            ) : !isMaxLevel && !isUpgrading && !isMoving && (
              <>
                <button
                  onClick={onUpgradeStorage}
                  disabled={!canAffordUpgrade}
                  className={`
                    w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)]
                    ${canAffordUpgrade ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}
                    transition-opacity
                  `}
                  style={{
                    backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-3.20.12%E2%80%AFPM.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  Upgrade to Level {tile.storage.level + 1} (${levelUpCost})
                </button>
                {!canAffordUpgrade && (
                  <p className="text-red-500 text-sm text-center">
                    Need ${levelUpCost - balance} more to upgrade
                  </p>
                )}
              </>
            )}
            
            {isMaxLevel && !isMoving && (
              <p className="text-gray-500 text-center">Maximum level reached</p>
            )}

            {isUpgrading && (
              <p className="text-blue-500 text-center">Upgrade in progress...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!tile.crop) return null;

  const levelUpCost = calculateLevelUpCost(tile.crop.level);
  const canAffordLevelUp = balance >= levelUpCost;
  const isMaxLevel = tile.crop.level >= CONSTANTS.MAX_CROP_LEVEL;
  const isHarvestable = canHarvest(tile.crop);

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Lv{tile.crop.level} Crop</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2 mb-4 text-sm text-gray-600">
            <p>Planted: {formatDateTime(tile.crop.plantedAt)}</p>
            <p>Time since planting: {formatDuration(Date.now() - tile.crop.plantedAt)}</p>
            <p>Current harvest duration: {formatDuration(tile.crop.harvestDuration)}</p>
            {hasPet && <p className="text-blue-600">Pet bonus: 1.1x harvest speed</p>}
          </div>

          {isMoving ? (
            <button
              onClick={onCancelMove}
              className="w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 bg-red-500"
            >
              Cancel Move
            </button>
          ) : (
            <button
              onClick={onMove}
              className="w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              style={{
                backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-3.20.12%E2%80%AFPM.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <Move className="w-5 h-5" />
              Move Crop
            </button>
          )}

          {!isMoving && (
            <>
              {!isMaxLevel && (
                <>
                  <button
                    onClick={handleLevelUp}
                    disabled={!canAffordLevelUp}
                    className={`
                      w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)]
                      ${canAffordLevelUp ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}
                      transition-opacity
                    `}
                    style={{
                      backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-3.20.12%E2%80%AFPM.png)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    Level Up (${levelUpCost})
                  </button>
                  {!canAffordLevelUp && (
                    <p className="text-red-500 text-sm text-center">
                      Need ${levelUpCost - balance} more to level up
                    </p>
                  )}
                </>
              )}
              
              {isHarvestable && (
                <button
                  onClick={onHarvest}
                  className="w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity"
                  style={{
                    backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-1.00.59%E2%80%AFPM.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  Harvest Crop
                </button>
              )}

              {!hasPet && canEmployPet && (
                <button
                  onClick={onEmployPet}
                  className="w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{
                    backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-3.20.12%E2%80%AFPM.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <Dog className="w-5 h-5" />
                  Employ Pet
                </button>
              )}

              {hasPet && (
                <button
                  onClick={onRemovePet}
                  className="w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{
                    backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-3.21.32%E2%80%AFPM.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <Dog className="w-5 h-5" />
                  Remove Pet
                </button>
              )}
              
              {isMaxLevel && (
                <p className="text-gray-500 text-center">Maximum level reached</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}