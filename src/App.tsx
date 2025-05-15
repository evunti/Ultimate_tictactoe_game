import { GameBoard } from "./GameBoard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hide header on mobile (smaller than sm) */}
      <header className="hidden sm:flex sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 justify-between items-center border-b">
        <h2 className="text-xl md:text-2xl font-semibold accent-text">
          Ultimate Tic Tac Toe
        </h2>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md mx-auto px-2 sm:px-0">
          <LocalPlay />
        </div>
      </main>
    </div>
  );
}

function LocalPlay() {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="text-center w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold accent-text mb-4">
          Ultimate Tic Tac Toe
        </h1>

        <p className="text-sm sm:text-base text-gray-700 mb-4 max-w-xl mx-auto"></p>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border w-full max-w-sm mx-auto">
          <h3 className="font-semibold text-base text-black">How to Play:</h3>
          <div className="text-xs sm:text-sm text-gray-600 space-y-2 flex flex-col items-start">
            <p>1. Win a small board to claim it.</p>
            <p>2. Your move tells your opponent where to play next.</p>
            <p>3. Win 3 small boards in a row to win the game!</p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
        <GameBoard />
      </div>
    </div>
  );
}
