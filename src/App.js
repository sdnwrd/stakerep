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
    <div className="min-h-screen bg-gray-900 text-white">  
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
                onClick={() => setCurrentGame('crash')}  
                className={`px-4 py-2 rounded ${currentGame === 'crash' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}  
              >  
                Crash  
              </button>  
              <button   
                onClick={() => setCurrentGame('dragon')}  
                className={`px-4 py-2 rounded ${currentGame === 'dragon' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}  
              >  
                Dragon Tower  
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
            <button  
              onClick={resetBalance}  
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm font-bold"  
            >  
              Reset  
            </button>  
          </div>  
        </div>  
      </header>  
  
      <main className="max-w-7xl mx-auto p-6">  
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">  
          <div className="lg:col-span-3">  
            {currentGame === 'mines' && <MinesGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}  
            {currentGame === 'crash' && <CrashGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}  
            {currentGame === 'dragon' && <DragonGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}  
            {currentGame === 'dice' && <DiceGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}  
            {currentGame === 'limbo' && <LimboGame balance={balance} updateBalance={updateBalance} addToHistory={addToHistory} />}  
          </div>  
  
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
    <div className="bg-gray-800 rounded-lg p-6">  
      <h2 className="text-2xl font-bold mb-6">Mines</h2>  
        
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">  
        <div>  
          <label className="block text-sm font-medium mb-2">Bet Amount</label>  
          <input  
            type="number"  
            value={betAmount}  
            onChange={(e) => setBetAmount(e.target.value)}  
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"  
            disabled={gameActive}  
            placeholder="0.10"  
            min="0.10"  
            step="0.10"  
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
            <option value={1}>1</option>  
            <option value={3}>3</option>  
            <option value={5}>5</option>  
            <option value={10}>10</option>  
          </select>  
        </div>  
          
        <div className="flex items-end">  
          {!gameActive ? (  
            <button  
              onClick={initializeGame}  
              disabled={parseFloat(betAmount) < 0.10 || parseFloat(betAmount) > balance || isNaN(parseFloat(betAmount))}  
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
              Cash Out ${(parseFloat(betAmount) * currentMultiplier).toFixed(2)}  
            </button>  
          )}  
        </div>  
      </div>  
  
      {gameActive && (  
        <div className="mb-4 text-center">  
          <div className="text-lg">  
            Multiplier: <span className="text-green-400 font-bold">{currentMultiplier.toFixed(2)}x</span>  
          </div>  
          <div className="text-sm text-gray-400">  
            Gems Found: {gemsFound} | Potential Payout: ${(parseFloat(betAmount) * currentMultiplier).toFixed(2)}  
          </div>  
        </div>  
      )}  
  
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
  
function CrashGame({ balance, updateBalance, addToHistory }) {  
  const [betAmount, setBetAmount] = React.useState('');  
  const [gameState, setGameState] = React.useState('waiting');  
  const [currentMultiplier, setCurrentMultiplier] = React.useState(1.00);  
  const [crashPoint, setCrashPoint] = React.useState(null);  
  const [hasBet, setHasBet] = React.useState(false);  
  const [hasCashedOut, setHasCashedOut] = React.useState(false);  
  const [gameHistory, setGameHistory] = React.useState([]);  
  
  const generateCrashPoint = () => {  
    const r = Math.random();  
    if (r < 0.33) return 1.00 + Math.random() * 0.99;  
    if (r < 0.66) return 2.00 + Math.random() * 3.00;  
    if (r < 0.90) return 5.00 + Math.random() * 10.00;  
    return 15.00 + Math.random() * 85.00;  
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
  };  
  
  const startGame = () => {  
    const crash = generateCrashPoint();  
    setCrashPoint(crash);  
    setGameState('flying');  
    setCurrentMultiplier(1.00);  
      
    const startTime = Date.now();  
    // Fixed duration regardless of crash point to prevent prediction  
    const baseDuration = 8000; // 8 seconds base duration  
      
    const animate = () => {  
      const elapsed = Date.now() - startTime;  
      const progress = elapsed / baseDuration;  
        
      // Exponential curve that accelerates quickly - like real Stake  
      const exponentialProgress = Math.pow(progress, 0.15); // Very low exponent for rapid acceleration  
      const current = 1 + (crash - 1) * exponentialProgress;  
        
      if (current >= crash || progress >= 1) {  
        setCurrentMultiplier(crash);  
        setGameState('crashed');  
        setGameHistory(prev => [crash, ...prev.slice(0, 9)]);  
          
        if (hasBet && !hasCashedOut) {  
          addToHistory('crash', parseFloat(betAmount), 0, -parseFloat(betAmount));  
        }  
          
        setTimeout(() => {  
          setGameState('waiting');  
          setHasBet(false);  
          setHasCashedOut(false);  
          setCrashPoint(null);  
        }, 3000);  
      } else {  
        setCurrentMultiplier(current);  
        requestAnimationFrame(animate);  
      }  
    };  
      
    requestAnimationFrame(animate);  
  };  
  
  return (  
    <div className="bg-gray-800 rounded-lg p-6">  
      <h2 className="text-2xl font-bold mb-6">Crash</h2>  
        
      <div className="text-center mb-8">  
        <div className="bg-gray-900 rounded-lg p-8 mb-4 relative overflow-hidden">  
          {gameState === 'waiting' && !hasBet && (  
            <div>  
              <div className="text-4xl font-bold text-gray-400 mb-2">  
                Waiting for bets...  
              </div>  
              <div className="text-lg text-gray-500">Place your bet to start!</div>  
            </div>  
          )}  
            
          {gameState === 'waiting' && hasBet && (  
            <div>  
              <div className="text-4xl font-bold text-yellow-400 mb-2">  
                Starting soon...  
              </div>  
              <div className="text-lg text-gray-500">Get ready!</div>  
            </div>  
          )}  
            
          {gameState === 'flying' && (  
            <div>  
              <div className={`text-6xl font-bold mb-2 transition-all duration-100 ${  
                currentMultiplier < 2 ? 'text-green-400' :  
                currentMultiplier < 5 ? 'text-yellow-400' :  
                currentMultiplier < 10 ? 'text-orange-400' : 'text-red-400'  
              }`}>  
                {currentMultiplier.toFixed(2)}x  
              </div>  
              <div className="text-lg text-gray-400">🚀 Flying...</div>  
            </div>  
          )}  
            
          {gameState === 'crashed' && (  
            <div>  
              <div className="text-6xl font-bold text-red-400 mb-2">  
                {crashPoint.toFixed(2)}x  
              </div>  
              <div className="text-lg text-red-400">💥 CRASHED!</div>  
            </div>  
          )}  
        </div>  
          
        <div className="flex justify-center space-x-2 mb-4">  
          {gameHistory.map((crash, index) => (  
            <div  
              key={index}  
              className={`px-3 py-1 rounded text-sm font-bold ${  
                crash < 2 ? 'bg-red-600' :  
                crash < 5 ? 'bg-yellow-600' :  
                crash < 10 ? 'bg-green-600' : 'bg-purple-600'  
              }`}  
            >  
              {crash.toFixed(2)}x  
            </div>  
          ))}  
        </div>  
      </div>  
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">  
        <div>  
          <label className="block text-sm font-medium mb-2">Bet Amount</label>  
          <input  
            type="number"  
            value={betAmount}  
            onChange={(e) => setBetAmount(e.target.value)}  
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"  
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
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"  
            >  
              Place Bet  
            </button>  
          )}  
            
          {gameState === 'flying' && hasBet && !hasCashedOut && (  
            <button  
              onClick={cashOut}  
              className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-bold"  
            >  
              Cash Out ${(parseFloat(betAmount) * currentMultiplier).toFixed(2)}  
            </button>  
          )}  
            
          {(hasBet || gameState === 'crashed') && (  
            <div className="w-full bg-gray-600 px-4 py-2 rounded font-bold text-center">  
              {hasCashedOut ? 'Cashed Out!' : hasBet ? 'Bet Placed' : 'Waiting...'}  
            </div>  
          )}  
        </div>  
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
    <div className="bg-gray-800 rounded-lg p-6">  
      <h2 className="text-2xl font-bold mb-6">Dragon Tower</h2>  
        
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">  
        <div>  
          <label className="block text-sm font-medium mb-2">Bet Amount</label>  
          <input  
            type="number"  
            value={betAmount}  
            onChange={(e) => setBetAmount(e.target.value)}  
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"  
            disabled={gameActive}  
            placeholder="0.10"  
            min="0.10"  
            step="0.10"  
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
              disabled={parseFloat(betAmount) < 0.10 || parseFloat(betAmount) > balance || isNaN(parseFloat(betAmount))}  
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
              Cash Out ${(parseFloat(betAmount) * currentMultiplier).toFixed(2)}  
            </button>  
          )}  
        </div>  
      </div>  
  
      {gameActive && (  
        <div className="mb-4 text-center">  
          <div className="text-lg">  
            Floor: {currentFloor + 1}/6 | Multiplier: <span className="text-green-400 font-bold">{currentMultiplier.toFixed(2)}x</span>  
          </div>  
        </div>  
      )}  
  
      <div className="max-w-sm mx-auto">  
        {Array.from({length: 6}, (_, floorIndex) => (  
          <div key={floorIndex} className={`mb-1 ${5 - floorIndex === currentFloor ? 'ring-2 ring-green-400' : ''}`}>  
            <div className="text-center text-xs mb-1">Floor {6 - floorIndex}</div>  
            <div className="grid grid-cols-4 gap-1">  
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
                      w-12 h-8 rounded border text-xs transition-all duration-200 flex items-center justify-center  
                      ${isRevealed && doorContent === 'egg'   
                        ? 'bg-red-600 border-red-500'   
                        : isRevealed && doorContent === 'safe'  
                        ? 'bg-green-600 border-green-500'  
                        : isCurrentFloor && gameActive  
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'  
                        : isPastFloor  
                        ? 'bg-green-600 border-green-500'  
                        : 'bg-gray-800 border-gray-700'  
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
    <div className="bg-gray-800 rounded-lg p-6">  
      <h2 className="text-2xl font-bold mb-6">Dice</h2>  
        
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">  
        <div>  
          <label className="block text-sm font-medium mb-2">Bet Amount</label>  
          <input  
            type="number"  
            value={betAmount}  
            onChange={(e) => setBetAmount(e.target.value)}  
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"  
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
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"  
          >  
            {isRolling ? 'Rolling...' : 'Roll Dice'}  
          </button>  
        </div>  
      </div>  
  
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
    if (r < 0.8) return 3.00 + Math.random() * 7.00;  
    return 10.00 + Math.random() * 90.00;  
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
    <div className="bg-gray-800 rounded-lg p-6">  
      <h2 className="text-2xl font-bold mb-6">Limbo</h2>  
        
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">  
        <div>  
          <label className="block text-sm font-medium mb-2">Bet Amount</label>  
          <input  
            type="number"  
            value={betAmount}  
            onChange={(e) => setBetAmount(e.target.value)}  
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"  
            disabled={isPlaying}  
            placeholder="0.10"  
            min="0.10"  
            step="0.10"  
          />  
        </div>  
          
        <div>  
          <label className="block text-sm font-medium mb-2">Target Multiplier</label>  
          <input  
            type="number"  
            value={targetMultiplier}  
            onChange={(e) => setTargetMultiplier(e.target.value)}  
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"  
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
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-bold"  
          >  
            {isPlaying ? 'Climbing...' : 'Start Climb'}  
          </button>  
        </div>  
      </div>  
  
      <div className="text-center">  
        <div className="mb-6">  
          <div className={`text-6xl font-bold mb-4 ${  
            crashed && crashPoint < parseFloat(targetMultiplier) ? 'text-red-400' :  
            crashed && crashPoint >= parseFloat(targetMultiplier) ? 'text-green-400' :  
            'text-yellow-400'  
          }`}>  
            {currentMultiplier.toFixed(2)}x  
          </div>  
            
          {isPlaying && (  
            <div className="text-lg text-gray-400">  
              Target: {parseFloat(targetMultiplier).toFixed(2)}x  
            </div>  
          )}  
            
          {crashed && (  
            <div className={`text-xl font-bold ${  
              crashPoint >= parseFloat(targetMultiplier) ? 'text-green-400' : 'text-red-400'  
            }`}>  
              {crashPoint >= parseFloat(targetMultiplier) ? 'WIN!' : 'CRASHED!'}  
            </div>  
          )}  
        </div>  
          
        <div className="bg-gray-700 p-4 rounded">  
          <div className="text-sm text-gray-400 mb-2">Win Chance</div>  
          <div className="text-lg font-bold">  
            {(100 / parseFloat(targetMultiplier || 2)).toFixed(2)}%  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
}  
  
export default App;
