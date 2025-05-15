import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { makeMove, resetGame } from "./gameSlice";

function checkWinner(board: string[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function GameBoard() {
  const game = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="bg-white/90 rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {game.boards.map((board, boardIndex) => (
            <div
              key={boardIndex}
              className={`relative aspect-square rounded-xl border-2 transition-colors duration-200 flex flex-col items-center justify-center
                ${game.activeBoard === -1 || game.activeBoard === boardIndex ? "bg-white border-slate-300" : "bg-slate-100 border-slate-200 opacity-60"}
              `}
              style={{ minWidth: 0 }}
            >
              {/* Winner overlay */}
              {game.innerWinners[boardIndex] && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 rounded-xl z-10">
                  <span
                    className={`font-extrabold text-5xl sm:text-6xl ${game.innerWinners[boardIndex] === "X" ? "text-blue-600" : "text-red-500"}`}
                  >
                    {game.innerWinners[boardIndex]}
                  </span>
                </div>
              )}
              {/* Mini board grid */}
              <div className="relative w-full h-full grid grid-cols-3 grid-rows-3 gap-1 sm:gap-2 z-0">
                {board.map((cell, position) => (
                  <button
                    key={position}
                    className={`w-full h-full aspect-square flex items-center justify-center text-2xl sm:text-3xl font-extrabold rounded-lg border border-slate-200 transition-colors duration-150
                      ${cell === "X" ? "text-blue-600" : cell === "O" ? "text-red-500" : "hover:bg-blue-50 active:bg-blue-100"}
                    `}
                    onClick={() => dispatch(makeMove({ boardIndex, position }))}
                    disabled={
                      cell !== "" ||
                      (game.activeBoard !== -1 &&
                        game.activeBoard !== boardIndex) ||
                      game.status !== "playing"
                    }
                  >
                    {cell}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center space-y-2">
        {game.status === "playing" ? (
          <p className="text-lg font-medium text-slate-700">
            Current turn:{" "}
            <span
              className={
                game.currentTurn === "X"
                  ? "text-blue-600 font-bold"
                  : "text-red-500 font-bold"
              }
            >
              {game.currentTurn}
            </span>
            .{" "}
            {game.activeBoard === -1
              ? "You can play in any board."
              : `Play in board ${game.activeBoard + 1}.`}
          </p>
        ) : game.status === "won" ? (
          <p className="text-2xl font-bold text-green-600 drop-shadow-sm">
            Winner: {game.currentTurn === "X" ? "O" : "X"}
          </p>
        ) : (
          <p className="text-2xl font-bold text-slate-500 drop-shadow-sm">
            Draw!
          </p>
        )}
        <button
          className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors text-base font-semibold"
          onClick={() => dispatch(resetGame())}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}
