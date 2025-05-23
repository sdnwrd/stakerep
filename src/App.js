import React from 'react';

function App() {
  const [balance, setBalance] = React.useState(() => {
    const saved = localStorage.getItem('stakeBalance');
    return saved ? parseFloat(saved) : 100.00;
  });

  const [currentGame, setCurrentGame] = React.useState('mines');
  const [gameHistory, setGameHistory] = React.useState([]);

  React.useEffect(() => {
    localStorage.setItem('stakeBalance', balance.toString());
  }, [balance]);

  const updateBalance = (amount) => {
    setBalance(prev => Math.max(0, prev + amount));
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-green-400">STAKE</h1>
            <nav className="flex space-x-6">
              <button 
                onClick={() => setCurrentGame('mines')}
                className={`px-4 py-2 rounded ${currentGame === 'mines' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Mines
              </button>
              <button 
                onClick={() => setCurrentGame('dragon')}
                className={`px-4 py-2 rounded ${currentGame === 'dragon' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Dragon Tower
              </button>
              <button 
                onClick={() => setCurrentGame('plinko')}
                className={`px-4 py-2 rounded ${currentGame === 'plinko' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Plinko
              </button>
              <button 
                onClick={() => setCurrentGame('dice')}
                className={`px-4 py-2 rounded ${currentGame === 'dice' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Dice
              </button>
              <button 
                onClick={() => setCurrentGame('limbo')}
                className={`px-4 py-2 rounded ${currentGame === 'limbo' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Limbo
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gray-700 px-4 py-2 rounded">
              <span className="text-green-400 font-bold">${balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-3">
            {currentGame === 'mines' && <MinesGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}
            {currentGame === 'dragon' && <DragonGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}
            {currentGame === 'plinko' && <PlinkoGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}
            {currentGame === 'dice' && <DiceGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}
            {currentGame === 'limbo' && <LimboGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}
          </div>

          {/* Sidebar */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Recent Bets</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {gameHistory.map(bet => (
                <div key={bet.id} className="bg-gray-700 p-3 rounded text-sm">
                  <div className="flex justify-between">
                    <span className="capitalize">{bet.game}</span>
                    <span className={bet.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {bet.profit >= 0 ? '+' : ''}${bet.profit.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs">
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

// Mines Game Component
function MinesGame({ balance, updateBalance, addToHistory }) {
  const [betAmount, setBetAmount] = React.useState(1.00);
  const [mineCount, setMineCount] = React.useState(3);
  const [gameActive, setGameActive] = React.useState(false);
  const [gameBoard, setGameBoard] = React.useState([]);
  const [revealedCells, setRevealedCells] = React.useState([]);
  const [minePositions, setMinePositions] = React.useState([]);
  const [currentMultiplier, setCurrentMultiplier] = React.useState(1);
  const [gemsFound, setGemsFound] = React.useState(0);

  const initializeGame = () => {
    if (betAmount < 0.10 || betAmount > balance) return;

    // Generate mine positions
    const mines = [];
    while (mines.length < mineCount) {
      const pos = Math.floor(Math.random() * 25);
      if (!mines.includes(pos)) mines.push(pos);
    }

    setMinePositions(mines);
    setGameBoard(Array(25).fill(null));
    setRevealedCells([]);
    setGameActive(true);
    setCurrentMultiplier(1);
    setGemsFound(0);
    updateBalance(-betAmount);
  };

  const revealCell = (index) => {
    if (!gameActive || revealedCells.includes(index)) return;

    const newRevealed = [...revealedCells, index];
    setRevealedCells(newRevealed);

    if (minePositions.includes(index)) {
      // Hit mine - game over
      setGameActive(false);
      setGameBoard(prev => {
        const newBoard = [...prev];
        minePositions.forEach(pos => newBoard[pos] = 'mine');
        return newBoard;
      });
      addToHistory('mines', betAmount, 0, -betAmount);
      playSound('explosion');
    } else {
      // Found gem
      const newGemsFound = gemsFound + 1;
      setGemsFound(newGemsFound);

      // Calculate multiplier based on gems found and mines
      const safeSpots = 25 - mineCount;
      const multiplier = calculateMinesMultiplier(newGemsFound, mineCount, safeSpots);
      setCurrentMultiplier(multiplier);

      setGameBoard(prev => {
        const newBoard = [...prev];
        newBoard[index] = 'gem';
        return newBoard;
      });
      playSound('gem');
    }
  };

  const cashOut = () => {
    if (!gameActive || gemsFound === 0) return;

    const payout = betAmount * currentMultiplier;
    const profit = payout - betAmount;

    setGameActive(false);
    updateBalance(payout);
    addToHistory('mines', betAmount, currentMultiplier, profit);
    playSound('cashout');
  };

  const calculateMinesMultiplier = (gems, mines, safeSpots) => {
    let multiplier = 1;
    for (let i = 0; i < gems; i++) {
      multiplier *= (safeSpots - i) / (25 - mines - i);
    }
    return multiplier;
  };

  const playSound = (type) => {
    // Sound effect placeholder
    console.log(`Playing ${type} sound`);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Mines</h2>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Bet Amount</label>
          <input
            type="number"
            min="0.10"
            step="0.10"
            value={betAmount}
            onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            disabled={gameActive}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mines</label>
          <select
            value={mineCount}
            onChange={(e) => setMineCount(parseInt(e.target.value))}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            disabled={gameActive}
          >
            {Array.from({length: 24}, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          {!gameActive ? (
            <button
              onClick={initializeGame}
              disabled={betAmount < 0.10 || betAmount > balance}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"
            >
              Start Game
            </button>
          ) : (
            <button
              onClick={cashOut}
              disabled={gemsFound === 0}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"
            >
              Cash Out ${(betAmount * currentMultiplier).toFixed(2)}
            </button>
          )}
        </div>
      </div>

      {/* Game Info */}
      {gameActive && (
        <div className="mb-4 text-center">
          <div className="text-lg">
            Multiplier: <span className="text-green-400 font-bold">{currentMultiplier.toFixed(2)}x</span>
          </div>
          <div className="text-sm text-gray-400">
            Gems Found: {gemsFound} | Potential Payout: ${(betAmount * currentMultiplier).toFixed(2)}
          </div>
        </div>
      )}

      {/* Game Board */}
      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
        {Array.from({length: 25}, (_, index) => (
          <button
            key={index}
            onClick={() => revealCell(index)}
            disabled={!gameActive || revealedCells.includes(index)}
            className={`
              aspect-square rounded-lg border-2 transition-all duration-200 text-2xl font-bold
              ${revealedCells.includes(index) 
                ? gameBoard[index] === 'mine' 
                  ? 'bg-red-600 border-red-500' 
                  : 'bg-green-600 border-green-500'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
              }
              ${!gameActive && minePositions.includes(index) ? 'bg-red-600 border-red-500' : ''}
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

// Dragon Tower Game Component
function DragonGame({ balance, updateBalance, addToHistory }) {
  const [betAmount, setBetAmount] = React.useState(1.00);
  const [difficulty, setDifficulty] = React.useState('easy');
  const [gameActive, setGameActive] = React.useState(false);
  const [currentFloor, setCurrentFloor] = React.useState(0);
  const [gameBoard, setGameBoard] = React.useState([]);
  const [currentMultiplier, setCurrentMultiplier] = React.useState(1);

  const difficultySettings = {
    easy: { eggs: 1, multiplier: 1.5 },
    medium: { eggs: 2, multiplier: 2.0 },
    hard: { eggs: 3, multiplier: 3.0 }
  };

  const initializeGame = () => {
    if (betAmount < 0.10 || betAmount > balance) return;

    const floors = [];
    for (let i = 0; i < 9; i++) {
      const floor = Array(4).fill('safe');
      const eggCount = difficultySettings[difficulty].eggs;

      // Place eggs randomly
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
    updateBalance(-betAmount);
  };

  const selectDoor = (doorIndex) => {
    if (!gameActive) return;

    const currentFloorData = gameBoard[currentFloor];
    if (currentFloorData[doorIndex] === 'egg') {
      // Hit egg - game over
      setGameActive(false);
      addToHistory('dragon', betAmount, 0, -betAmount);
      playSound('explosion');
    } else {
      // Safe door
      const newMultiplier = currentMultiplier * difficultySettings[difficulty].multiplier;
      setCurrentMultiplier(newMultiplier);

      if (currentFloor === 8) {
        // Reached top - auto cash out
        const payout = betAmount * newMultiplier;
        const profit = payout - betAmount;
        setGameActive(false);
        updateBalance(payout);
        addToHistory('dragon', betAmount, newMultiplier, profit);
        playSound('victory');
      } else {
        setCurrentFloor(prev => prev + 1);
        playSound('success');
      }
    }
  };

  const cashOut = () => {
    if (!gameActive || currentFloor === 0) return;

    const payout = betAmount * currentMultiplier;
    const profit = payout - betAmount;

    setGameActive(false);
    updateBalance(payout);
    addToHistory('dragon', betAmount, currentMultiplier, profit);
    playSound('cashout');
  };

  const playSound = (type) => {
    console.log(`Playing ${type} sound`);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Dragon Tower</h2>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Bet Amount</label>
          <input
            type="number"
            min="0.10"
            step="0.10"
            value={betAmount}
            onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            disabled={gameActive}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
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
              disabled={betAmount < 0.10 || betAmount > balance}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"
            >
              Start Game
            </button>
          ) : (
            <button
              onClick={cashOut}
              disabled={currentFloor === 0}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"
            >
              Cash Out ${(betAmount * currentMultiplier).toFixed(2)}
            </button>
          )}
        </div>
      </div>

      {/* Game Info */}
      {gameActive && (
        <div className="mb-4 text-center">
          <div className="text-lg">
            Floor: {currentFloor + 1}/9 | Multiplier: <span className="text-green-400 font-bold">{currentMultiplier.toFixed(2)}x</span>
          </div>
          <div className="text-sm text-gray-400">
            Potential Payout: ${(betAmount * currentMultiplier).toFixed(2)}
          </div>
        </div>
      )}

      {/* Game Tower */}
      <div className="max-w-md mx-auto">
        {Array.from({length: 9}, (_, floorIndex) => (
          <div key={floorIndex} className={`mb-2 ${8 - floorIndex === currentFloor ? 'ring-2 ring-green-400' : ''}`}>
            <div className="text-center text-sm mb-1">Floor {9 - floorIndex}</div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({length: 4}, (_, doorIndex) => (
                <button
                  key={doorIndex}
                  onClick={() => 8 - floorIndex === currentFloor && selectDoor(doorIndex)}
                  disabled={!gameActive || 8 - floorIndex !== currentFloor}
                  className={`
                    aspect-square rounded-lg border-2 transition-all duration-200 text-xl
                    ${8 - floorIndex === currentFloor && gameActive
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                      : 8 - floorIndex > currentFloor
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-green-600 border-green-500'
                    }
                  `}
                >
                  {8 - floorIndex < currentFloor ? '🚪' : ''}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Plinko Game Component  
function PlinkoGame({ balance, updateBalance, addToHistory }) {
  const [betAmount, setBetAmount] = React.useState(1.00);
  const [rows, setRows] = React.useState(12);
  const [risk, setRisk] = React.useState('medium');
  const [isDropping, setIsDropping] = React.useState(false);

  const riskMultipliers = {
    low: {
      8: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
      12: [8.4, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 8.4],
      16: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]
    },
    medium: {
      8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
      12: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
      16: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110]
    },
    high: {
      8: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
      12: [141, 23, 8.1, 2, 0.9, 0.3, 0.2, 0.3, 0.9, 2, 8.1, 23, 141],
      16: [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000]
    }
  };

  const dropBall = () => {
    if (betAmount < 0.10 || betAmount > balance || isDropping) return;

    setIsDropping(true);
    updateBalance(-betAmount);

    // Simulate ball drop
    setTimeout(() => {
      const multipliers = riskMultipliers[risk][rows];
      const bucketIndex = Math.floor(Math.random() * multipliers.length);
      const multiplier = multipliers[bucketIndex];
      const payout = betAmount * multiplier;
      const profit = payout - betAmount;

      updateBalance(payout);
      addToHistory('plinko', betAmount, multiplier, profit);
      setIsDropping(false);

      if (multiplier > 1) {
        playSound('win');
      } else {
        playSound('lose');
      }
    }, 2000);
  };

  const playSound = (type) => {
    console.log(`Playing ${type} sound`);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Plinko</h2>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Bet Amount</label>
          <input
            type="number"
            min="0.10"
            step="0.10"
            value={betAmount}
            onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            disabled={isDropping}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Rows</label>
          <select
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value))}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            disabled={isDropping}
          >
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Risk</label>
          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            disabled={isDropping}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={dropBall}
            disabled={betAmount < 0.10 || betAmount > balance || isDropping}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"
          >
            {isDropping ? 'Dropping...' : 'Drop Ball'}
          </button>
        </div>
      </div>

      {/* Plinko Board Visualization */}
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <div className={`inline-block w-4 h-4 rounded-full ${isDropping ? 'bg-yellow-400 animate-bounce' : 'bg-gray-600'}`}></div>
        </div>

        {/* Multiplier Display */}
        <div className="grid gap-1 mb-4" style={{gridTemplateColumns: `repeat(${riskMultipliers[risk][rows].length}, 1fr)`}}>
          {riskMultipliers[risk][rows].map((multiplier, index) => (
            <div
              key={index}
              className={`text-center p-2 rounded text-sm font-bold ${
                multiplier >= 10 ? 'bg-red-600' :
                multiplier >= 2 ? 'bg-yellow-600' :
                multiplier >= 1 ? 'bg-green-600' :
                'bg-gray-600'
              }`}
            >
              {multiplier}x
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dice Game Component
function DiceGame({ balance, updateBalance, addToHistory }) {
  const [betAmount, setBetAmount] = React.useState(1.00);
  const [prediction, setPrediction] = React.useState(50);
  const [isOver, setIsOver] = React.useState(true);
  const [isRolling, setIsRolling] = React.useState(false);
  const [lastRoll, setLastRoll] = React.useState(null);

  const calculateMultiplier = () => {
    const winChance = isOver ? (100 - prediction) : prediction;
    return (99 / winChance).toFixed(4);
  };

  const rollDice = () => {
    if (betAmount < 0.10 || betAmount > balance || isRolling) return;

    setIsRolling(true);
    updateBalance(-betAmount);

    setTimeout(() => {
      const roll = Math.random() * 100;
      setLastRoll(roll);

      const won = isOver ? roll > prediction : roll < prediction;
      const multiplier = parseFloat(calculateMultiplier());
      const payout = won ? betAmount * multiplier : 0;
      const profit = payout - betAmount;

      if (won) {
        updateBalance(payout);
        playSound('win');
      } else {
        playSound('lose');
      }

      addToHistory('dice', betAmount, won ? multiplier : 0, profit);
      setIsRolling(false);
    }, 1000);
  };

  const playSound = (type) => {
    console.log(`Playing ${type} sound`);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Dice</h2>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Bet Amount</label>
          <input
            type="number"
            min="0.10"
            step="0.10"
            value={betAmount}
            onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            disabled={isRolling}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={rollDice}
            disabled={betAmount < 0.10 || betAmount > balance || isRolling}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>
        </div>
      </div>

      {/* Prediction Controls */}
      <div className="mb-6">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => setIsOver(false)}
            className={`px-6 py-2 rounded font-bold ${!isOver ? 'bg-red-600' : 'bg-gray-700'}`}
            disabled={isRolling}
          >
            Roll Under
          </button>
          <button
            onClick={() => setIsOver(true)}
            className={`px-6 py-2 rounded font-bold ${isOver ? 'bg-green-600' : 'bg-gray-700'}`}
            disabled={isRolling}
          >
            Roll Over
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Prediction: {prediction.toFixed(2)}
          </label>
          <input
            type="range"
            min="1"
            max="99"
            step="0.01"
            value={prediction}
            onChange={(e) => setPrediction(parseFloat(e.target.value))}
            className="w-full"
            disabled={isRolling}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-700 p-3 rounded">
            <div className="text-sm text-gray-400">Win Chance</div>
            <div className="text-lg font-bold">
              {(isOver ? 100 - prediction : prediction).toFixed(2)}%
            </div>
          </div>
          <div className="bg-gray-700 p-3 rounded">
            <div className="text-sm text-gray-400">Multiplier</div>
            <div className="text-lg font-bold text-green-400">
              {calculateMultiplier()}x
            </div>
          </div>
        </div>
      </div>

      {/* Dice Display */}
      <div className="text-center">
        <div className="mb-4">
          <div className={`inline-block w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center text-2xl font-bold ${isRolling ? 'animate-spin' : ''}`}>
            {lastRoll !== null ? lastRoll.toFixed(2) : '?'}
          </div>
        </div>

        {lastRoll !== null && (
          <div className="text-lg">
            Result: <span className={`font-bold ${
              (isOver && lastRoll > prediction) || (!isOver && lastRoll < prediction) 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {(isOver && lastRoll > prediction) || (!isOver && lastRoll < prediction) ? 'WIN' : 'LOSE'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Limbo Game Component
function LimboGame({ balance, updateBalance, addToHistory }) {
  const [betAmount, setBetAmount] = React.useState(1.00);
  const [targetMultiplier, setTargetMultiplier] = React.useState(2.00);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentMultiplier, setCurrentMultiplier] = React.useState(1.00);
  const [crashed, setCrashed] = React.useState(false);
  const [crashPoint, setCrashPoint] = React.useState(null);

  const startGame = () => {
    if (betAmount < 0.10 || betAmount > balance || isPlaying) return;

    setIsPlaying(true);
    setCrashed(false);
    setCrashPoint(null);
    setCurrentMultiplier(1.00);
    updateBalance(-betAmount);

    // Generate crash point
    const crash = generateCrashPoint();
    setCrashPoint(crash);

    // Animate multiplier increase
    const interval = setInterval(() => {
      setCurrentMultiplier(prev => {
        const next = prev + 0.01;
        if (next >= crash) {
          clearInterval(interval);
          setCrashed(true);
          setIsPlaying(false);

          if (targetMultiplier <= crash) {
            // Player wins
            const payout = betAmount * targetMultiplier;
            const profit = payout - betAmount;
            updateBalance(payout);
            addToHistory('limbo', betAmount, targetMultiplier, profit);
            playSound('win');
          } else {
            // Player loses
            addToHistory('limbo', betAmount, 0, -betAmount);
            playSound('crash');
          }

          return crash;
        }
        return next;
      });
    }, 50);
  };

  const generateCrashPoint = () => {
    // House edge of 1%
    const r = Math.random();
    return Math.max(1.00, Math.floor((99 / (r * 99)) * 100) / 100);
  };

  const playSound = (type) => {
    console.log(`Playing ${type} sound`);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Limbo</h2>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Bet Amount</label>
          <input
            type="number"
            min="0.10"
            step="0.10"
            value={betAmount}
            onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            disabled={isPlaying}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Target Multiplier</label>
          <input
            type="number"
            min="1.01"
            step="0.01"
            value={targetMultiplier}
            onChange={(e) => setTargetMultiplier(parseFloat(e.target.value) || 1.01)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
            disabled={isPlaying}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={startGame}
            disabled={betAmount < 0.10 || betAmount > balance || isPlaying}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"
          >
            {isPlaying ? 'Flying...' : 'Start Flight'}
          </button>
        </div>
      </div>

      {/* Game Display */}
      <div className="text-center">
        <div className="mb-6">
          <div className={`text-6xl font-bold ${
            crashed 
              ? targetMultiplier <= crashPoint 
                ? 'text-green-400' 
                : 'text-red-400'
              : isPlaying 
                ? 'text-yellow-400' 
                : 'text-gray-400'
          }`}>
            {currentMultiplier.toFixed(2)}x
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-gray-700 p-3 rounded">
            <div className="text-sm text-gray-400">Target</div>
            <div className="text-lg font-bold">{targetMultiplier.toFixed(2)}x</div>
          </div>
          <div className="bg-gray-700 p-3 rounded">
            <div className="text-sm text-gray-400">Potential Payout</div>
            <div className="text-lg font-bold text-green-400">
              ${(betAmount * targetMultiplier).toFixed(2)}
            </div>
          </div>
        </div>

        {crashed && (
          <div className="mt-4">
            <div className="text-lg">
              Crashed at <span className="font-bold">{crashPoint.toFixed(2)}x</span>
            </div>
            <div className={`text-xl font-bold ${
              targetMultiplier <= crashPoint ? 'text-green-400' : 'text-red-400'
            }`}>
              {targetMultiplier <= crashPoint ? 'YOU WIN!' : 'CRASHED!'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;