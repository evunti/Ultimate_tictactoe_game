import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { makeMove, resetGame } from "./gameSlice";

export function GameBoard() {
  const game = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl  accent-text mt-4">Current Game: </h1>
      <div className="grid grid-cols-3 gap-2 p-4 bg-gray-100 rounded-xl">
        {game.boards.map((board, boardIndex) => (
          <div
            key={boardIndex}
            className={`relative ${
              game.activeBoard === -1 || game.activeBoard === boardIndex
                ? "bg-white"
                : "bg-gray-50"
            } p-2 rounded-lg border-2 border-gray-300`}
          >
            {/* Add board label and winner */}
            <div className="absolute top-0 left-0 p-1 text-xs text-gray-500">
              Board {boardIndex + 1}
            </div>
            {game.innerWinners[boardIndex] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                <span className="text-6xl font-bold text-indigo-600">
                  {game.innerWinners[boardIndex]}
                </span>
              </div>
            )}
            <div className="grid grid-cols-3 mt-4">
              {board.map((cell, position) => (
                <button
                  key={position}
                  className="w-10 h-10 bg-white flex items-center justify-center text-lg font-bold hover:bg-gray-50 border border-gray-300"
                  onClick={() => dispatch(makeMove({ boardIndex, position }))}
                  disabled={
                    cell !== "" ||
                    (game.activeBoard !== -1 && game.activeBoard !== boardIndex)
                  }
                >
                  {cell}
                </button>
              ))}
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
