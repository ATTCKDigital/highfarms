import React from 'react';
import { Tile } from './Tile';
import { GameState } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  containerRef: React.RefObject<HTMLDivElement>;
  onTileClick: (tileId: string) => void;
  onTileHarvest: (tileId: string) => void;
  isMoving: boolean;
}

export function GameBoard({ gameState, containerRef, onTileClick, onTileHarvest, isMoving }: GameBoardProps) {
  return (
    <div className="w-full pt-0 pb-4 px-4">
      <div 
        className="grid grid-cols-5 gap-1 mx-auto relative mt-2"
        style={{
          width: '100%',
          maxWidth: '600px'
        }}
      >
        {/* Background pattern container */}
        <div 
          className="absolute inset-0 -m-1"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://attck.com/wp-content/uploads/DALL·E-2025-01-21-19.17.34-A-cartoonish-background-wallpaper-showing-light-brown-soil-with-a-smooth-even-surface.-The-texture-should-be-stylized-with-light-brown-tones-and-sub.webp)',
            backgroundSize: '200px',
            backgroundRepeat: 'repeat',
            zIndex: -1
          }}
        />
        
        {gameState.tiles.map((tile) => (
          <Tile 
            key={tile.id} 
            tile={tile}
            style={{
              width: '100%',
              aspectRatio: '1/1'
            }}
            onClick={() => onTileClick(tile.id)}
            onHarvest={() => onTileHarvest(tile.id)}
            showMoveHighlight={isMoving && tile.type === 'empty'}
          />
        ))}
      </div>
    </div>
  );
}