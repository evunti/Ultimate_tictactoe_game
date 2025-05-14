import { GameBoard } from "./GameBoard";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">
          Ultimate Tic Tac Toe
        </h2>
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md mx-auto">
          <LocalPlay />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function LocalPlay() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold accent-text mb-4">
          Ultimate Tic Tac Toe
        </h1>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-base text-black">How to Play:</h3>
          <div className="text-sm text-gray-600 space-y-2 flex flex-col items-start">
            <p>1. Win small boards to claim them in the big game</p>
            <p>
              2. Your move determines which board your opponent must play in
              next
            </p>
            <p>3. Win three small boards in a row to win the game!</p>
          </div>
        </div>
      </div>
      <GameBoard />
    </div>
  );
}
