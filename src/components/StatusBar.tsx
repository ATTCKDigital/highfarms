import React, { useState, useEffect, useCallback } from 'react';
import { Leaf, Warehouse, X } from 'lucide-react';
import { CONSTANTS } from '../types/game';
import { formatDateTime, formatDuration, formatNumber, calculateNextFarmLevelCost } from '../utils/gameUtils';

interface StatusBarProps {
  balance: number;
  hemp: number;
  availablePets: number;
  totalPets: number;
  startedAt: number;
  farmLevel: number;
  onSellHemp: (amount: number) => void;
  onBonusReward: () => void;
  onFarmLevelUp: () => void;
  maxBalance: number;
}

export function StatusBar({ 
  balance, 
  hemp, 
  availablePets, 
  totalPets, 
  startedAt,
  farmLevel,
  onSellHemp, 
  onBonusReward,
  onFarmLevelUp,
  maxBalance
}: StatusBarProps) {
  const [showSellPopup, setShowSellPopup] = useState(false);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [showFarmLevelPopup, setShowFarmLevelPopup] = useState(false);
  const [adCountdown, setAdCountdown] = useState(15);
  const [showCollectButton, setShowCollectButton] = useState(false);
  const [showBonusButton, setShowBonusButton] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(Date.now() - startedAt);
  const maxSellableAmount = Math.floor(hemp / CONSTANTS.HEMP_SELL_AMOUNT) * CONSTANTS.HEMP_SELL_AMOUNT;
  const nextLevelCost = calculateNextFarmLevelCost(farmLevel);

  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setShowSellPopup(false);
      setShowAdPopup(false);
      setShowFarmLevelPopup(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startedAt);
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <>
      <div 
        className="p-4 flex justify-center gap-8 z-10 relative shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        style={{
          backgroundImage: 'url(https://attck.com/wp-content/uploads/dnicenyc_httpss.mj_.runmQIeHQnCxFE_a_full-width_rectangular_webs_76ab10b1-ffdc-4cbf-9ff4-f5107a342f5b.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">$</span>
          <div className="relative w-32">
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${(balance / maxBalance) * 100}%` }}
              />
            </div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              ${formatNumber(balance)} / ${formatNumber(maxBalance)}
            </span>
          </div>
        </div>
        <div 
          onClick={() => hemp >= CONSTANTS.HEMP_SELL_AMOUNT && setShowSellPopup(true)}
          className={`relative flex items-center ${hemp >= CONSTANTS.HEMP_SELL_AMOUNT ? 'cursor-pointer hover:text-yellow-300' : 'cursor-default'}`}
        >
          <Leaf className="absolute -left-2 w-5 h-5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] z-10" />
          <div className="relative w-32">
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(hemp / CONSTANTS.INITIAL_MAX_HEMP) * 100}%` }}
              />
            </div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              {formatNumber(hemp)} / {formatNumber(CONSTANTS.INITIAL_MAX_HEMP)}
            </span>
          </div>
        </div>
        <div 
          className="flex items-center gap-2 cursor-pointer hover:text-yellow-300"
          onClick={() => setShowFarmLevelPopup(true)}
        >
          <Warehouse className="w-5 h-5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
        </div>
      </div>

      {showSellPopup && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20" onClick={handleBackdropClick}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sell HEMP</h2>
              <button onClick={() => setShowSellPopup(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">Current HEMP</h3>
                <p className="text-gray-600 mb-3">
                  You have: {formatNumber(hemp)} HEMP<br />
                  Sell amount: {formatNumber(CONSTANTS.HEMP_SELL_AMOUNT)} HEMP<br />
                  Sell price: ${formatNumber(CONSTANTS.HEMP_SELL_PRICE)}
                </p>
                <button
                  onClick={() => {
                    onSellHemp(maxSellableAmount);
                    setShowSellPopup(false);
                  }}
                  disabled={hemp < CONSTANTS.HEMP_SELL_AMOUNT}
                  className={`
                    w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)]
                    ${hemp >= CONSTANTS.HEMP_SELL_AMOUNT ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}
                    transition-opacity
                  `}
                  style={{
                    backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-3.20.12%E2%80%AFPM.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  Sell {formatNumber(maxSellableAmount)} HEMP for ${formatNumber(maxSellableAmount / CONSTANTS.HEMP_SELL_AMOUNT * CONSTANTS.HEMP_SELL_PRICE)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFarmLevelPopup && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20" onClick={handleBackdropClick}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Farm Management</h2>
              <button onClick={() => setShowFarmLevelPopup(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Farm Level {farmLevel}</h3>
                <div className="space-y-2">
                  <h4 className="font-medium">Current Benefits:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    <li>Maximum Bank Level: {CONSTANTS.INITIAL_MAX_BANK_LEVEL}</li>
                    <li>Maximum Banks: {farmLevel}</li>
                    <li>Grid Size: {CONSTANTS.INITIAL_GRID_COLS}x{CONSTANTS.INITIAL_GRID_ROWS}</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">Level Up Requirements</h3>
                <p className="text-gray-600 mb-3">
                  Money: ${formatNumber(nextLevelCost.money)}<br />
                  HEMP: {formatNumber(nextLevelCost.hemp)}
                </p>
                <button
                  onClick={onFarmLevelUp}
                  disabled={balance < nextLevelCost.money || hemp < nextLevelCost.hemp}
                  className={`
                    w-full py-2 px-4 rounded-full text-white font-bold shadow-[0_4px_14px_0_rgba(0,0,0,0.25)]
                    ${balance >= nextLevelCost.money && hemp >= nextLevelCost.hemp
                      ? 'hover:opacity-90'
                      : 'opacity-50 cursor-not-allowed'
                    }
                    transition-opacity
                  `}
                  style={{
                    backgroundImage: 'url(https://attck.com/wp-content/uploads/Screenshot-2025-01-21-at-3.20.12%E2%80%AFPM.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  Level Up to {farmLevel + 1}
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">Pet Management</h3>
                <p className="text-gray-600 mb-3">
                  Available Pets: {availablePets}/{totalPets}
                </p>
                <div className="text-sm text-gray-600">
                  <p>• Pets increase harvest speed by 10%</p>
                  <p>• Each pet can be assigned to one crop</p>
                  <p>• Pets automatically harvest when crops are ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}