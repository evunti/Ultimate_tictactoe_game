import { GameBoard } from "./GameBoard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-slate-200">
      <header className="py-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight mb-2 drop-shadow-md">
          UltimateTTT
        </h1>
        <div className="text-lg sm:text-xl text-slate-600 font-medium mb-4">
          Ultimate Tic Tac Toe – Play Online
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-start px-2 pb-8">
        <div className="w-full max-w-md">
          <HowToPlayCard />
        </div>
        <div className="w-full max-w-2xl mt-8 flex justify-center">
          <GameBoard />
        </div>
      </main>
    </div>
  );
}

function HowToPlayCard() {
  return (
    <div className="bg-white/90 p-4 sm:p-6 rounded-xl shadow-md border border-slate-200 mb-4">
      <h2 className="font-semibold text-lg text-slate-800 mb-2">How to Play</h2>
      <ul className="list-decimal list-inside text-slate-700 text-sm space-y-1">
        <li>Win a small board to claim it.</li>
        <li>Your move tells your opponent where to play next.</li>
        <li>Win 3 small boards in a row to win the game!</li>
      </ul>
    </div>
  );
}
