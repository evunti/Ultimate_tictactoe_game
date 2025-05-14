import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { makeMove, resetGame } from "./gameSlice";

export function GameBoard() {
  const game = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h1 className="text-3xl accent-text mt-4">Current Game: </h1>
      <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 sm:p-4 bg-gray-100 rounded-xl w-full max-w-xs sm:max-w-sm md:max-w-md">
        {game.boards.map((board, boardIndex) => (
          <div
            key={boardIndex}
            className={`relative aspect-square flex flex-col pt-5 sm:pt-6 ${
              game.activeBoard === -1 || game.activeBoard === boardIndex
                ? "bg-white"
                : "bg-gray-50"
            } p-1 sm:p-2 rounded-lg border-2 border-gray-300`}
            style={{ minWidth: 0 }}
          >
            {/* Board label, positioned at the top, above the board */}
            <div className="absolute top-1 left-1 z-20 px-1 py-0.5 text-[10px] sm:text-xs text-gray-500 bg-white/80 rounded">
              Board {boardIndex + 1}
            </div>
            {/* Winner overlay, covers the board but not the label */}
            {game.innerWinners[boardIndex] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg z-10">
                <span className="text-4xl sm:text-6xl font-bold text-indigo-600">
                  {game.innerWinners[boardIndex]}
                </span>
              </div>
            )}
            {/* Mini board grid with visible lines using gap and background */}
            <div className="relative flex-1 z-0">
              {/* Sharper hashtag grid overlay */}
              <div className="pointer-events-none absolute inset-0 z-10">
                {/* Vertical lines */}
                <div className="absolute top-0 bottom-0 left-1/3 w-px bg-gray-500 opacity-100" />
                <div className="absolute top-0 bottom-0 left-2/3 w-px bg-gray-500 opacity-100" />
                {/* Horizontal lines */}
                <div className="absolute left-0 right-0 top-1/3 h-px bg-gray-500 opacity-100" />
                <div className="absolute left-0 right-0 top-2/3 h-px bg-gray-500 opacity-100" />
              </div>
              <div className="grid grid-cols-3 gap-0 w-full h-full">
                {board.map((cell, position) => (
                  <button
                    key={position}
                    className="w-7 h-7 sm:w-10 sm:h-10 bg-white flex items-center justify-center text-base sm:text-lg font-bold hover:bg-indigo-50 transition-colors duration-150"
                    style={{ boxSizing: "border-box" }}
                    onClick={() => dispatch(makeMove({ boardIndex, position }))}
                    disabled={
                      cell !== "" ||
                      (game.activeBoard !== -1 &&
                        game.activeBoard !== boardIndex)
                    }
                  >
                    {cell}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center space-y-2">
        {game.status === "playing" ? (
          <p>
            Current turn: {game.currentTurn}.{" "}
            {game.activeBoard === -1
              ? "You can play in any board."
              : `Play in board ${game.activeBoard + 1}.`}
          </p>
        ) : game.status === "won" ? (
          <p className="text-xl font-bold text-indigo-600">
            Winner: {game.currentTurn === "X" ? "O" : "X"}
          </p>
        ) : (
          <p className="text-xl font-bold text-gray-600">Draw!</p>
        )}
        <button
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => dispatch(resetGame())}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}
