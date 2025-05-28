import React from 'react';

function App() {
  const [balance, setBalance] = React.useState(() => {
    const saved = localStorage.getItem('stakeBalance1');
    return saved ? parseFloat(saved) : 100.00;
  });
  
  const [currentGame, setCurrentGame] = React.useState('crash');
  const [gameHistory, setGameHistory] = React.useState([]);

  React.useEffect(() => {
    localStorage.setItem('stakeBalance1', balance.toString());
  }, [balance]);

  const updateBalance = (amount) => {
    setBalance(prev => Math.max(0, prev + amount));
  };

  const resetBalance = () => {
    if (window.confirm('Are you sure you want to reset your balance to $100.00?')) {
      setBalance(100.00);
      setGameHistory([]);
    }
  };

  const addToHistory = (game, bet, payout, profit) => {
    setGameHistory(prev => [{
      id: Date.now(),
      game,
      bet,
      payout,
      profit,
      timestamp: new Date()
    }, ...prev.slice(0, 49)]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <header className="bg-black bg-opacity-50 backdrop-blur-md border-b border-purple-500 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              STAKE
            </h1>
            <nav className="flex space-x-4">
              <button 
                onClick={() => setCurrentGame('crash')}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  currentGame === 'crash' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/25' 
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                🚀 Crash
              </button>
              <button 
                onClick={() => setCurrentGame('mines')}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  currentGame === 'mines' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/25' 
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                💎 Mines
              </button>
              <button 
                onClick={() => setCurrentGame('dragon')}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  currentGame === 'dragon' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/25' 
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                🐉 Dragon Tower
              </button>
              <button 
                onClick={() => setCurrentGame('dice')}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  currentGame === 'dice' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/25' 
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                🎲 Dice
              </button>
              <button 
                onClick={() => setCurrentGame('limbo')}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  currentGame === 'limbo' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-lg shadow-green-500/25' 
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                🎯 Limbo
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 rounded-lg shadow-lg">
              <span className="text-white font-bold text-lg">${balance.toFixed(2)}</span>
            </div>
            <button
              onClick={resetBalance}
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-300 shadow-lg"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {currentGame === 'crash' && <CrashGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}
            {currentGame === 'mines' && <MinesGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}
            {currentGame === 'dragon' && <DragonGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}
            {currentGame === 'dice' && <DiceGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}
            {currentGame === 'limbo' && <LimboGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}
          </div>

          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Recent Bets</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {gameHistory.map(bet => (
                <div key={bet.id} className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-600 transition-all duration-300 hover:border-purple-500">
                  <div className="flex justify-between items-center">
                    <span className="capitalize font-semibold">{bet.game}</span>
                    <span className={`font-bold ${bet.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {bet.profit >= 0 ? '+' : ''}${bet.profit.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    Bet: ${bet.bet.toFixed(2)} | Payout: {bet.payout.toFixed(2)}x
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CrashGame({ balance, updateBalance, addToHistory }) {
  const [betAmount, setBetAmount] = React.useState('');
  const [gameState, setGameState] = React.useState('waiting');
  const [currentMultiplier, setCurrentMultiplier] = React.useState(1.00);
  const [crashPoint, setCrashPoint] = React.useState(null);
  const [hasBet, setHasBet] = React.useState(false);
  const [hasCashedOut, setHasCashedOut] = React.useState(false);
  const [gameHistory, setGameHistory] = React.useState([]);
  const [rocketPosition, setRocketPosition] = React.useState(0);
  const [particles, setParticles] = React.useState([]);

  const generateCrashPoint = () => {
    const r = Math.random();
    if (r < 0.33) return 1.00 + Math.random() * 0.99;
    if (r < 0.66) return 2.00 + Math.random() * 3.00;
    if (r < 0.90) return 5.00 + Math.random() * 10.00;
    return 15.00 + Math.random() * 85.00;
  };

  const createParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    setParticles(newParticles);
  };

  const placeBet = () => {
    const bet = parseFloat(betAmount);
    if (bet < 0.10 || bet > balance || isNaN(bet) || gameState !== 'waiting') return;
    
    setHasBet(true);
    updateBalance(-bet);
    
    setTimeout(() => {
      startGame();
    }, 1000);
  };

  const cashOut = () => {
    if (!hasBet || hasCashedOut || gameState !== 'flying') return;
    
    const bet = parseFloat(betAmount);
    const payout = bet * currentMultiplier;
    const profit = payout - bet;
    
    setHasCashedOut(true);
    updateBalance(payout);
    addToHistory('crash', bet, currentMultiplier, profit);
    
    // Success animation
    createParticles();
  };

  const startGame = () => {
    const crash = generateCrashPoint();
    setCrashPoint(crash);
    setGameState('flying');
    setCurrentMultiplier(1.00);
    setRocketPosition(0);
    createParticles();
    
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      // Fixed increment per frame for smooth animation
      const increment = 0.005 + (currentMultiplier - 1) * 0.002; // Starts slow, gets faster
      const newMultiplier = currentMultiplier + increment;
      
      // Update rocket position
      setRocketPosition(prev => Math.min(prev + 2, 80));
      
      if (newMultiplier >= crash) {
        setCurrentMultiplier(crash);
        setGameState('crashed');
        setGameHistory(prev => [crash, ...prev.slice(0, 9)]);
        
        if (hasBet && !hasCashedOut) {
          addToHistory('crash', parseFloat(betAmount), 0, -parseFloat(betAmount));
        }
        
        // Crash animation
        setParticles([]);
        
        setTimeout(() => {
          setGameState('waiting');
          setHasBet(false);
          setHasCashedOut(false);
          setCrashPoint(null);
          setRocketPosition(0);
        }, 3000);
      } else {
        setCurrentMultiplier(newMultiplier);
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        🚀 Crash Game
      </h2>
      
      <div className="text-center mb-8">
        <div className="bg-black rounded-xl p-8 mb-6 relative overflow-hidden border border-purple-500 shadow-lg shadow-purple-500/25">
          {/* Background particles */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity
              }}
            />
          ))}
          
          {/* Rocket */}
          <div 
            className="absolute text-4xl transition-all duration-300 ease-out"
            style={{
              left: `${rocketPosition}%`,
              bottom: `${rocketPosition}%`,
              transform: gameState === 'crashed' ? 'rotate(180deg)' : 'rotate(45deg)'
            }}
          >
            {gameState === 'crashed' ? '💥' : '🚀'}
          </div>
          
          {gameState === 'waiting' && !hasBet && (
            <div className="animate-pulse">
              <div className="text-4xl font-bold text-gray-400 mb-2">
                Waiting for bets...
              </div>
              <div className="text-lg text-gray-500">Place your bet to start!</div>
            </div>
          )}
          
          {gameState === 'waiting' && hasBet && (
            <div className="animate-bounce">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                Starting soon...
              </div>
              <div className="text-lg text-gray-500">Get ready! 🚀</div>
            </div>
          )}
          
          {gameState === 'flying' && (
            <div>
              <div className={`text-8xl font-bold mb-4 transition-all duration-200 animate-pulse ${
                currentMultiplier < 2 ? 'text-green-400' :
                currentMultiplier < 5 ? 'text-yellow-400' :
                currentMultiplier < 10 ? 'text-orange-400' : 'text-red-400'
              }`}>
                {currentMultiplier.toFixed(2)}x
              </div>
              <div className="text-xl text-gray-400 animate-pulse">🚀 Flying to the moon...</div>
            </div>
          )}
          
          {gameState === 'crashed' && (
            <div className="animate-bounce">
              <div className="text-8xl font-bold text-red-400 mb-4 animate-pulse">
                {crashPoint.toFixed(2)}x
              </div>
              <div className="text-2xl text-red-400">💥 CRASHED!</div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-2 mb-6">
          {gameHistory.map((crash, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-110 ${
                crash < 2 ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/25' :
                crash < 5 ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 shadow-lg shadow-yellow-500/25' :
                crash < 10 ? 'bg-gradient-to-r from-green-600 to-green-700 shadow-lg shadow-green-500/25' : 
                'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/25'
              }`}
            >
              {crash.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Bet Amount</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 transition-all duration-300"
            disabled={hasBet || gameState === 'flying'}
            placeholder="0.10"
            min="0.10"
            step="0.10"
          />
        </div>
        
        <div className="flex items-end">
          {gameState === 'waiting' && !hasBet && (
            <button
              onClick={placeBet}
              disabled={parseFloat(betAmount) < 0.10 || parseFloat(betAmount) > balance || isNaN(parseFloat(betAmount))}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 Place Bet
            </button>
          )}
          
          {gameState === 'flying' && hasBet && !hasCashedOut && (
            <button
              onClick={cashOut}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse"
            >
              💰 Cash Out ${(parseFloat(betAmount) * currentMultiplier).toFixed(2)}
            </button>
          )}
          
          {(hasBet || gameState === 'crashed') && (
            <div className="w-full bg-gray-700 px-6 py-3 rounded-lg font-bold text-center border border-gray-600">
              {hasCashedOut ? '✅ Cashed Out!' : hasBet ? '⏳ Bet Placed' : 'Waiting...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MinesGame({ balance, updateBalance, addToHistory }) {
  const [betAmount, setBetAmount] = React.useState('');
  const [mineCount, setMineCount] = React.useState(3);
  const [gameActive, setGameActive] = React.useState(false);
  const [gameBoard, setGameBoard] = React.useState([]);
  const [revealedCells, setRevealedCells] = React.useState([]);
  const [minePositions, setMinePositions] = React.useState([]);
  const [currentMultiplier, setCurrentMultiplier] = React.useState(1);
  const [gemsFound, setGemsFound] = React.useState(0);

  const getMultiplierTable = (mines) => {
    const tables = {
      1: [1.03, 1.07, 1.12, 1.18, 1.24, 1.32, 1.41, 1.52, 1.65, 1.80, 1.98, 2.20, 2.48, 2.83, 3.26, 3.81, 4.52, 5.45, 6.71, 8.45, 11.02, 15.12, 22.09, 36.83],
      3: [1.12, 1.29, 1.48, 1.71, 2.00, 2.35, 2.79, 3.35, 4.07, 5.00, 6.26, 7.96, 10.35, 13.80, 18.97, 26.95, 39.69, 60.54, 97.52, 166.90, 300.41, 577.50],
      5: [1.24, 1.56, 2.00, 2.58, 3.39, 4.52, 6.14, 8.43, 11.78, 16.83, 24.47, 36.83, 56.44, 88.83, 143.88, 242.85, 435.60, 823.50, 1647.00],
      10: [1.55, 2.18, 3.09, 4.42, 6.42, 9.42, 14.12, 21.56, 33.51, 53.22, 86.49, 144.15, 249.26, 449.68, 849.15, 1698.30, 3616.35, 8240.79]
    };
    return tables[mines] || tables[3];
  };

  const initializeGame = () => {
    const bet = parseFloat(betAmount);
    if (bet < 0.10 || bet > balance || isNaN(bet)) return;
    
    const mines = [];
    while (mines.length < mineCount) {
      const pos = Math.floor(Math.random() * 25);
      if (!mines.includes(pos)) mines.push(pos);
    }
    
    setMinePositions(mines);
    setGameBoard(Array(25).fill(null));
    setRevealedCells([]);
    setGameActive(true);
    setCurrentMultiplier(1.00);
    setGemsFound(0);
    updateBalance(-bet);
  };

  const revealCell = (index) => {
    if (!gameActive || revealedCells.includes(index)) return;
    
    const newRevealed = [...revealedCells, index];
    setRevealedCells(newRevealed);
    
    if (minePositions.includes(index)) {
      setGameActive(false);
      setGameBoard(prev => {
        const newBoard = [...prev];
        minePositions.forEach(pos => newBoard[pos] = 'mine');
        return newBoard;
      });
      addToHistory('mines', parseFloat(betAmount), 0, -parseFloat(betAmount));
    } else {
      const newGemsFound = gemsFound + 1;
      setGemsFound(newGemsFound);
      
      const multiplierTable = getMultiplierTable(mineCount);
      const multiplier = multiplierTable[newGemsFound - 1] || 1.00;
      setCurrentMultiplier(multiplier);
      
      setGameBoard(prev => {
        const newBoard = [...prev];
        newBoard[index] = 'gem';
        return newBoard;
      });
    }
  };

  const cashOut = () => {
    if (!gameActive || gemsFound === 0) return;
    
    const bet = parseFloat(betAmount);
    const payout = bet * currentMultiplier;
    const profit = payout - bet;
    
    setGameActive(false);
    updateBalance(payout);
    addToHistory('mines', bet, currentMultiplier, profit);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        💎 Mines
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Bet Amount</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 transition-all duration-300"
            disabled={gameActive}
            placeholder="0.10"
            min="0.10"
            step="0.10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Mines</label>
          <select
            value={mineCount}
            onChange={(e) => setMineCount(parseInt(e.target.value))}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 transition-all duration-300"
            disabled={gameActive}
          >
            <option value={1}>1 Mine</option>
            <option value={3}>3 Mines</option>
            <option value={5}>5 Mines</option>
            <option value={10}>10 Mines</option>
          </select>
        </div>
        
        <div className="flex items-end">
          {!gameActive ? (
            <button
              onClick={initializeGame}
              disabled={parseFloat(betAmount) < 0.10 || parseFloat(betAmount) > balance || isNaN(parseFloat(betAmount))}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              💎 Start Game
            </button>
          ) : (
            <button
              onClick={cashOut}
              disabled={gemsFound === 0}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse"
            >
              💰 Cash Out ${(parseFloat(betAmount) * currentMultiplier).toFixed(2)}
            </button>
          )}
        </div>
      </div>

      {gameActive && (
        <div className="mb-6 text-center bg-gray-900 rounded-lg p-4 border border-purple-500">
          <div className="text-2xl mb-2">
            Multiplier: <span className="text-green-400 font-bold animate-pulse">{currentMultiplier.toFixed(2)}x</span>
          </div>
          <div className="text-gray-400">
            Gems Found: {gemsFound} | Potential Payout: ${(parseFloat(betAmount) * currentMultiplier).toFixed(2)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-3 max-w-lg mx-auto">
        {Array.from({length: 25}, (_, index) => (
          <button
            key={index}
            onClick={() => revealCell(index)}
            disabled={!gameActive || revealedCells.includes(index)}
            className={`
              aspect-square rounded-lg border-2 transition-all duration-300 text-3xl font-bold transform hover:scale-105
              ${revealedCells.includes(index) 
                ? gameBoard[index] === 'mine' 
                  ? 'bg-gradient-to-br from-red-600 to-red-800 border-red-500 shadow-lg shadow-red-500/50 animate-pulse' 
                  : 'bg-gradient-to-br from-green-600 to-green-800 border-green-500 shadow-lg shadow-green-500/50'
                : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/25'
              }
              ${!gameActive && minePositions.includes(index) ? 'bg-gradient-to-br from-red-600 to-red-800 border-red-500' : ''}
            `}
          >
            {revealedCells.includes(index) && gameBoard[index] === 'gem' && '💎'}
            {(revealedCells.includes(index) || !gameActive) && gameBoard[index] === 'mine' && '💣'}
            {(!gameActive && minePositions.includes(index) && !revealedCells.includes(index)) && '💣'}
          </button>
        ))}
      </div>
    </div>
  );
}

function DragonGame({ balance, updateBalance, addToHistory }) {
  const [betAmount, setBetAmount] = React.useState('');
  const [difficulty, setDifficulty] = React.useState('easy');
  const [gameActive, setGameActive] = React.useState(false);
  const [currentFloor, setCurrentFloor] = React.useState(0);
  const [gameBoard, setGameBoard] = React.useState([]);
  const [currentMultiplier, setCurrentMultiplier] = React.useState(1);
  const [revealedDoors, setRevealedDoors] = React.useState([]);
  const [gameOver, setGameOver] = React.useState(false);

  const difficultySettings = {
    easy: { eggs: 1, multiplier: 1.5 },
    medium: { eggs: 2, multiplier: 2.0 },
    hard: { eggs: 3, multiplier: 3.0 }
  };

  const initializeGame = () => {
    const bet = parseFloat(betAmount);
    if (bet < 0.10 || bet > balance || isNaN(bet)) return;
    
    const floors = [];
    for (let i = 0; i < 6; i++) {
      const floor = Array(4).fill('safe');
      const eggCount = difficultySettings[difficulty].eggs;
      
      const eggPositions = [];
      while (eggPositions.length < eggCount) {
        const pos = Math.floor(Math.random() * 4);
        if (!eggPositions.includes(pos)) {
          eggPositions.push(pos);
          floor[pos] = 'egg';
        }
      }
      floors.push(floor);
    }
    
    setGameBoard(floors);
    setCurrentFloor(0);
    setGameActive(true);
    setCurrentMultiplier(1);
    setRevealedDoors([]);
    setGameOver(false);
    updateBalance(-bet);
  };

  const selectDoor = (doorIndex) => {
    if (!gameActive || gameOver) return;
    
    const floorKey = `${currentFloor}-${doorIndex}`;
    const newRevealed = [...revealedDoors, floorKey];
    setRevealedDoors(newRevealed);
    
    const currentFloorData = gameBoard[currentFloor];
    if (currentFloorData[doorIndex] === 'egg') {
      setGameActive(false);
      setGameOver(true);
      
      const allEggsRevealed = [...newRevealed];
      currentFloorData.forEach((cell, index) => {
        if (cell === 'egg') {
          allEggsRevealed.push(`${currentFloor}-${index}`);
        }
      });
      setRevealedDoors(allEggsRevealed);
      
      addToHistory('dragon', parseFloat(betAmount), 0, -parseFloat(betAmount));
    } else {
      const newMultiplier = currentMultiplier * difficultySettings[difficulty].multiplier;
      setCurrentMultiplier(newMultiplier);
      
      if (currentFloor === 5) {
        const bet = parseFloat(betAmount);
        const payout = bet * newMultiplier;
        const profit = payout - bet;
        setGameActive(false);
        updateBalance(payout);
        addToHistory('dragon', bet, newMultiplier, profit);
      } else {
        setCurrentFloor(prev => prev + 1);
      }
    }
  };

  const cashOut = () => {
    if (!gameActive || currentFloor === 0) return;
    
    const bet = parseFloat(betAmount);
    const payout = bet * currentMultiplier;
    const profit = payout - bet;
    
    setGameActive(false);
    updateBalance(payout);
    addToHistory('dragon', bet, currentMultiplier, profit);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        🐉 Dragon Tower
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Bet Amount</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 transition-all duration-300"
            disabled={gameActive}
            placeholder="0.10"
            min="0.10"
            step="0.10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 transition-all duration-300"
            disabled={gameActive}
          >
            <option value="easy">Easy (1 Egg)</option>
            <option value="medium">Medium (2 Eggs)</option>
            <option value="hard">Hard (3 Eggs)</option>
          </select>
        </div>
        
        <div className="flex items-end">
          {!gameActive ? (
            <button
              onClick={initializeGame}
              disabled={parseFloat(betAmount) < 0.10 || parseFloat(betAmount) > balance || isNaN(parseFloat(betAmount))}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🐉 Start Game
            </button>
          ) : (
            <button
              onClick={cashOut}
              disabled={currentFloor === 0}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse"
            >
              💰 Cash Out ${(parseFloat(betAmount) * currentMultiplier).toFixed(2)}
            </button>
          )}
        </div>
      </div>

      {gameActive && (
        <div className="mb-6 text-center bg-gray-900 rounded-lg p-4 border border-purple-500">
          <div className="text-2xl">
            Floor: {currentFloor + 1}/6 | Multiplier: <span className="text-green-400 font-bold animate-pulse">{currentMultiplier.toFixed(2)}x</span>
          </div>
        </div>
      )}

      <div className="max-w-sm mx-auto">
        {Array.from({length: 6}, (_, floorIndex) => (
          <div key={floorIndex} className={`mb-2 ${5 - floorIndex === currentFloor ? 'ring-2 ring-green-400 rounded-lg p-1' : ''}`}>
            <div className="text-center text-sm mb-2 font-bold">Floor {6 - floorIndex}</div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({length: 4}, (_, doorIndex) => {
                const floorKey = `${5 - floorIndex}-${doorIndex}`;
                const isRevealed = revealedDoors.includes(floorKey);
                const isCurrentFloor = 5 - floorIndex === currentFloor;
                const isPastFloor = 5 - floorIndex < currentFloor;
                const doorContent = gameBoard[5 - floorIndex] ? gameBoard[5 - floorIndex][doorIndex] : null;
                
                return (
                  <button
                    key={doorIndex}
                    onClick={() => isCurrentFloor && selectDoor(doorIndex)}
                    disabled={!gameActive || !isCurrentFloor}
                    className={`
                      w-14 h-10 rounded-lg border-2 text-lg transition-all duration-300 flex items-center justify-center transform hover:scale-105
                      ${isRevealed && doorContent === 'egg' 
                        ? 'bg-gradient-to-br from-red-600 to-red-800 border-red-500 shadow-lg shadow-red-500/50 animate-pulse' 
                        : isRevealed && doorContent === 'safe'
                        ? 'bg-gradient-to-br from-green-600 to-green-800 border-green-500 shadow-lg shadow-green-500/50'
                        : isCurrentFloor && gameActive
                        ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/25'
                        : isPastFloor
                        ? 'bg-gradient-to-br from-green-600 to-green-800 border-green-500'
                        : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                      }
                    `}
                  >
                    {isRevealed && doorContent === 'egg' && '🥚'}
                    {isRevealed && doorContent === 'safe' && '🚪'}
                    {isPastFloor && !isRevealed && '🚪'}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiceGame({ balance, updateBalance, addToHistory }) {
  const [betAmount, setBetAmount] = React.useState('');
  const [prediction, setPrediction] = React.useState(50);
  const [isOver, setIsOver] = React.useState(true);
  const [isRolling, setIsRolling] = React.useState(false);
  const [lastRoll, setLastRoll] = React.useState(null);

  const calculateMultiplier = () => {
    const winChance = isOver ? (100 - prediction) : prediction;
    return (99 / winChance).toFixed(4);
  };

  const rollDice = () => {
    const bet = parseFloat(betAmount);
    if (bet < 0.10 || bet > balance || isRolling || isNaN(bet)) return;
    
    setIsRolling(true);
    updateBalance(-bet);
    
    setTimeout(() => {
      const roll = Math.random() * 100;
      setLastRoll(roll);
      
      const won = isOver ? roll > prediction : roll < prediction;
      const multiplier = parseFloat(calculateMultiplier());
      const payout = won ? bet * multiplier : 0;
      const profit = payout - bet;
      
      if (won) {
        updateBalance(payout);
      }
      
      addToHistory('dice', bet, won ? multiplier : 0, profit);
      setIsRolling(false);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        🎲 Dice
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Bet Amount</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 transition-all duration-300"
            disabled={isRolling}
            placeholder="0.10"
            min="0.10"
            step="0.10"
          />
        </div>
        
        <div className="flex items-end">
          <button
            onClick={rollDice}
            disabled={parseFloat(betAmount) < 0.10 || parseFloat(betAmount) > balance || isRolling || isNaN(parseFloat(betAmount))}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setIsOver(false)}
            className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${
              !isOver 
                ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-500/25' 
                : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
            }`}
            disabled={isRolling}
          >
            Roll Under
          </button>
          <button
            onClick={() => setIsOver(true)}
            className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${
              isOver 
                ? 'bg-gradient-to-r from-green-600 to-green-700 shadow-lg shadow-green-500/25' 
                : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
            }`}
            disabled={isRolling}
          >
            Roll Over
          </button>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-300">
            Prediction: {prediction.toFixed(2)}
          </label>
          <input
            type="range"
            min="1"
            max="99"
            step="0.01"
            value={prediction}
            onChange={(e) => setPrediction(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            disabled={isRolling}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <div className="text-sm text-gray-400 mb-1">Win Chance</div>
            <div className="text-xl font-bold text-green-400">
              {(isOver ? 100 - prediction : prediction).toFixed(2)}%
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
            <div className="text-sm text-gray-400 mb-1">Multiplier</div>
            <div className="text-xl font-bold text-blue-400">
              {calculateMultiplier()}x
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="mb-6">
          <div className={`inline-block w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-3xl font-bold border-2 border-gray-600 shadow-lg ${isRolling ? 'animate-spin' : ''}`}>
            {lastRoll !== null ? lastRoll.toFixed(2) : '?'}
          </div>
        </div>
        
        {lastRoll !== null && (
          <div className="text-2xl">
            Result: <span className={`font-bold ${
              (isOver && lastRoll > prediction) || (!isOver && lastRoll < prediction) 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {(isOver && lastRoll > prediction) || (!isOver && lastRoll < prediction) ? '🎉 WIN' : '💥 LOSE'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function LimboGame({ balance, updateBalance, addToHistory }) {
  const [betAmount, setBetAmount] = React.useState('');
  const [targetMultiplier, setTargetMultiplier] = React.useState('2.00');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentMultiplier, setCurrentMultiplier] = React.useState(1.00);
  const [crashed, setCrashed] = React.useState(false);
  const [crashPoint, setCrashPoint] = React.useState(null);

  const generateCrashPoint = () => {
    const r = Math.random();
    if (r < 0.5) return 1.00 + Math.random() * 1.99;
    if (r < 1.2) return 3.00 + Math.random() * 7.00;
    return 10.00 + Math.random() * 45.00;
  };

  const startGame = () => {
    const bet = parseFloat(betAmount);
    const target = parseFloat(targetMultiplier);
    if (bet < 0.10 || bet > balance || isPlaying || isNaN(bet) || isNaN(target)) return;
    
    setIsPlaying(true);
    setCrashed(false);
    setCrashPoint(null);
    setCurrentMultiplier(1.00);
    updateBalance(-bet);
    
    const crash = generateCrashPoint();
    setCrashPoint(crash);
    
    const startTime = Date.now();
    const duration = Math.min(1500, crash * 200);
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        setCurrentMultiplier(crash);
        setCrashed(true);
        setIsPlaying(false);
        
        if (target <= crash) {
          const payout = bet * target;
          const profit = payout - bet;
          updateBalance(payout);
          addToHistory('limbo', bet, target, profit);
        } else {
          addToHistory('limbo', bet, 0, -bet);
        }
      } else {
        const current = 1 + (crash - 1) * Math.pow(progress, 0.3);
        setCurrentMultiplier(current);
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-2xl">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        🎯 Limbo
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Bet Amount</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 transition-all duration-300"
            disabled={isPlaying}
            placeholder="0.10"
            min="0.10"
            step="0.10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Target Multiplier</label>
          <input
            type="number"
            value={targetMultiplier}
            onChange={(e) => setTargetMultiplier(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 transition-all duration-300"
            disabled={isPlaying}
            placeholder="2.00"
            min="1.01"
            step="0.01"
          />
        </div>
        
        <div className="flex items-end">
          <button
            onClick={startGame}
            disabled={parseFloat(betAmount) < 0.10 || parseFloat(betAmount) > balance || isPlaying || isNaN(parseFloat(betAmount))}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isPlaying ? '🎯 Climbing...' : '🎯 Start Climb'}
          </button>
        </div>
      </div>

      <div className="text-center">
        <div className="mb-8">
          <div className={`text-8xl font-bold mb-6 transition-all duration-300 ${
            crashed && crashPoint < parseFloat(targetMultiplier) ? 'text-red-400 animate-pulse' :
            crashed && crashPoint >= parseFloat(targetMultiplier) ? 'text-green-400 animate-pulse' :
            'text-yellow-400'
          }`}>
            {currentMultiplier.toFixed(2)}x
          </div>
          
          {isPlaying && (
            <div className="text-xl text-gray-400 animate-pulse">
              Target: {parseFloat(targetMultiplier).toFixed(2)}x
            </div>
          )}
          
          {crashed && (
            <div className={`text-3xl font-bold animate-bounce ${
              crashPoint >= parseFloat(targetMultiplier) ? 'text-green-400' : 'text-red-400'
            }`}>
              {crashPoint >= parseFloat(targetMultiplier) ? '🎉 WIN!' : '💥 CRASHED!'}
            </div>
          )}
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-600">
          <div className="text-sm text-gray-400 mb-2">Win Chance</div>
          <div className="text-2xl font-bold text-blue-400">
            {(100 / parseFloat(targetMultiplier || 2)).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
