import React, { useEffect, useState, useMemo } from 'react';
import { Dog } from 'lucide-react';
import { Tile as TileType } from '../types/game';
import { canHarvest, getHarvestProgress, formatDuration, getStorageBuildProgress, isStorageComplete, getBankBuildProgress, isBankComplete } from '../utils/gameUtils';

interface TileProps {
  tile: TileType;
  style?: React.CSSProperties;
  onClick: () => void;
  onHarvest?: () => void;
  showMoveHighlight?: boolean;
}

const emptyTileBackgrounds = [
  'https://attck.com/wp-content/uploads/Screenshot-2025-01-17-at-3.51.33%E2%80%AFPM.png',
  'https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-12.17.47%E2%80%AFPM.png',
  'https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-12.19.23%E2%80%AFPM.png',
  'https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-12.20.24%E2%80%AFPM.png'
];

const petImages = [
  'https://attck.com/wp-content/uploads/10.png',
  'https://attck.com/wp-content/uploads/9.png',
  'https://attck.com/wp-content/uploads/8.png',
  'https://attck.com/wp-content/uploads/7.png',
  'https://attck.com/wp-content/uploads/6.png',
  'https://attck.com/wp-content/uploads/5.png',
  'https://attck.com/wp-content/uploads/4.png',
  'https://attck.com/wp-content/uploads/3.png',
  'https://attck.com/wp-content/uploads/2.png',
  'https://attck.com/wp-content/uploads/1.png'
];

export function Tile({ tile, style, onClick, onHarvest, showMoveHighlight }: TileProps) {
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const backgroundImage = useMemo(() => {
    if (tile.type === 'empty') {
      const hash = Math.abs(
        Math.sin(tile.x * 179 + tile.y * 283) * 
        Math.cos(tile.y * 419 + tile.x * 157) * 
        10000
      );
      return emptyTileBackgrounds[Math.floor(hash % emptyTileBackgrounds.length)];
    }
    return null;
  }, [tile.x, tile.y, tile.type]);

  const petImage = useMemo(() => {
    if (tile.crop?.employedPetId) {
      const hash = Math.abs(
        Math.sin(parseInt(tile.crop.employedPetId.replace(/\D/g, '')) * 179) * 
        Math.cos(tile.x * 419 + tile.y * 157) * 
        10000
      );
      return petImages[Math.floor(hash % petImages.length)];
    }
    return null;
  }, [tile.crop?.employedPetId, tile.x, tile.y]);

  useEffect(() => {
    if (tile.type === 'storage' && tile.storage) {
      const updateProgress = () => {
        setProgress(getStorageBuildProgress(tile.storage!));
        const now = Date.now();
        const elapsed = now - tile.storage!.buildStartedAt;
        const remaining = Math.max(0, tile.storage!.buildDuration - elapsed);
        setTimeRemaining(remaining);
      };

      updateProgress();
      const interval = setInterval(updateProgress, 1000);
      return () => clearInterval(interval);
    }

    if (tile.type === 'bank' && tile.bank) {
      const updateProgress = () => {
        setProgress(getBankBuildProgress(tile.bank!));
        const now = Date.now();
        const elapsed = now - tile.bank!.buildStartedAt;
        const remaining = Math.max(0, tile.bank!.buildDuration - elapsed);
        setTimeRemaining(remaining);
      };

      updateProgress();
      const interval = setInterval(updateProgress, 1000);
      return () => clearInterval(interval);
    }
  }, [tile.storage, tile.bank, tile.type]);

  useEffect(() => {
    if (tile.crop) {
      const updateTimes = () => {
        setProgress(getHarvestProgress(tile.crop!));
        const now = Date.now();
        const elapsed = now - tile.crop!.lastHarvestedAt;
        const remaining = Math.max(0, tile.crop!.harvestDuration - elapsed);
        setTimeRemaining(remaining);
      };

      updateTimes();
      const interval = setInterval(updateTimes, 1000);
      return () => clearInterval(interval);
    }
  }, [tile.crop]);

  useEffect(() => {
    if (tile.crop?.employedPetId) {
      const checkHarvest = () => {
        if (canHarvest(tile.crop!)) {
          onHarvest?.();
        }
      };
      
      checkHarvest();
      const interval = setInterval(checkHarvest, 1000);
      return () => clearInterval(interval);
    }
  }, [tile.crop, onHarvest]);

  const isHarvestable = tile.crop && canHarvest(tile.crop);
  const hasPet = tile.crop?.employedPetId;

  const handleHarvest = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHarvest?.();
  };

  const tileNumber = tile.y * 10 + tile.x + 1;

  const getBackgroundStyle = () => {
    if (tile.type === 'empty') {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    if (tile.type === 'storage') {
      const isBuilding = !isStorageComplete(tile.storage!);
      const isLevel2 = tile.storage!.level === 2;
      const isLevel3 = tile.storage!.level === 3;
      const isLevel4Plus = tile.storage!.level >= 4;
      const isUpgrading = tile.storage!.upgrading;
      return {
        backgroundImage: `url(${isBuilding || isUpgrading
          ? 'https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-2.58.38%E2%80%AFPM.png'
          : isLevel4Plus
            ? 'https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-4.24.43%E2%80%AFPM.png'
            : isLevel3
              ? 'https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-4.07.43%E2%80%AFPM.png'
              : isLevel2
                ? 'https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-3.38.33%E2%80%AFPM.png'
                : 'https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-2.21.07%E2%80%AFPM.png'
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }

    if (tile.type === 'bank' && tile.bank) {
      const isBuilding = !isBankComplete(tile.bank);
      const isUpgrading = tile.bank.upgrading;
      return {
        backgroundImage: `url(${isBuilding || isUpgrading
          ? 'https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-2.58.38%E2%80%AFPM.png'
          : 'https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-6.23.00%E2%80%AFPM.png'
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    if (tile.crop?.employedPetId) {
      return {
        backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-12.11.23%E2%80%AFPM.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    if (tile.crop && !isHarvestable) {
      return {
        backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-11.59.20%E2%80%AFAM.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    if (tile.crop && isHarvestable) {
      return {
        backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-12.01.18%E2%80%AFPM.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    return {
      backgroundImage: `url(${emptyTileBackgrounds[0]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  };

  return (
    <div 
      onClick={onClick}
      style={{
        ...style,
        ...getBackgroundStyle()
      }}
      className={`
        relative cursor-pointer transition-all duration-200 overflow-hidden
        rounded-md
        group hover:border hover:border-white/30 hover:border-dotted
        ${showMoveHighlight ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-green-900' : ''}
      `}
    >
      {/* Dark overlay for empty tiles */}
      {tile.type === 'empty' && (
        <div className="absolute inset-0 bg-green-900/60" />
      )}

      {(tile.type === 'storage' && tile.storage) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          {/* Level indicator */}
          <div className="absolute top-0.5 left-0.5 bg-black/40 px-1 py-0.5 rounded-md text-[10px] sm:text-xs text-white font-bold">
            Lv{tile.storage.level}
          </div>

          {/* Build/upgrade progress */}
          {(!isStorageComplete(tile.storage) || tile.storage.upgrading) && (
            <div className="absolute top-0.5 right-0.5 bg-black/40 px-1 py-0.5 rounded-md text-[10px] sm:text-xs text-white font-bold">
              {formatDuration(timeRemaining)}
            </div>
          )}
          
          {/* Progress bar */}
          {(!isStorageComplete(tile.storage) || tile.storage.upgrading) && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-black/20">
              <div 
                className="h-full bg-blue-500/50 transition-all duration-1000"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {(tile.type === 'bank' && tile.bank) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          {/* Level indicator */}
          <div className="absolute top-0.5 left-0.5 bg-black/40 px-1 py-0.5 rounded-md text-[10px] sm:text-xs text-white font-bold">
            Lv{tile.bank.level}
          </div>

          {/* Build/upgrade progress */}
          {(!isBankComplete(tile.bank) || tile.bank.upgrading) && (
            <div className="absolute top-0.5 right-0.5 bg-black/40 px-1 py-0.5 rounded-md text-[10px] sm:text-xs text-white font-bold">
              {formatDuration(timeRemaining)}
            </div>
          )}
          
          {/* Progress bar */}
          {(!isBankComplete(tile.bank) || tile.bank.upgrading) && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-black/20">
              <div 
                className="h-full bg-yellow-500/50 transition-all duration-1000"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
        </div>
      )}

      {tile.crop && (
        <div className={`
          absolute inset-0
          flex flex-col items-center justify-center gap-1
          ${isHarvestable ? 'bg-yellow-500/20' : 'bg-green-900/20'}
          rounded-md
        `}>
          {/* Level indicator - Smaller text on mobile */}
          <div className="absolute top-0.5 left-0.5 bg-black/40 px-1 py-0.5 rounded-md text-[10px] sm:text-xs text-white font-bold">
            Lv{tile.crop.level}
          </div>

          {/* Time remaining - Smaller text on mobile */}
          {!isHarvestable && (
            <div className="absolute top-0.5 right-0.5 bg-black/40 px-1 py-0.5 rounded-md text-[10px] sm:text-xs text-white font-bold">
              {formatDuration(timeRemaining)}
            </div>
          )}

          {/* Pet indicator - Now using random pet images */}
          {hasPet && petImage && (
            <div 
              className="absolute bottom-2.5 right-1 w-1/4 aspect-square rounded-md overflow-hidden"
              style={{
                backgroundImage: `url(${petImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}
          
          {isHarvestable && !hasPet && (
            <button
              onClick={handleHarvest}
              className="text-[10px] sm:text-xs font-bold text-white bg-black/20 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md hover:bg-black/30 transition-colors"
            >
              Ready
            </button>
          )}
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-black/20">
            <div 
              className="h-full bg-green-500/50 transition-all duration-1000"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Tile number - Smaller on mobile */}
      <div className="absolute bottom-0.5 right-0.5 text-[8px] sm:text-[10px] font-medium text-green-300/40">
        {tileNumber}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200 rounded-md" />
    </div>
  );
}