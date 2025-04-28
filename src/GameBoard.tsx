import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function GameBoard({ gameId }: { gameId: Id<"games"> }) {
  const game = useQuery(api.games.getGame, { gameId });
  const makeMove = useMutation(api.games.makeMove);

  if (!game) return null;

  const handleClick = async (boardIndex: number, position: number) => {
    try {
      await makeMove({ gameId, boardIndex, position });
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const isValidMove = (boardIndex: number) => {
    return (
      (game.activeBoard ?? -1) === -1 || (game.activeBoard ?? -1) === boardIndex
    );
  };

  const boards =
    game.boards ??
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(""));
  const innerWinners = game.innerWinners ?? Array(9).fill("");

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main game board with distinct borders */}
      <div className="grid grid-cols-3 gap-2 p-4 bg-gray-100 rounded-xl">
        {boards.map((board, boardIndex) => (
          <div
            key={boardIndex}
            className={`relative ${
              isValidMove(boardIndex) ? "bg-white" : "bg-gray-50"
            } p-2 rounded-lg border-2 border-gray-300`}
          >
            {/* Board number */}
            <div className="absolute top-0 left-0 p-1 text-xs text-gray-500">
              Board {boardIndex + 1}
            </div>
            {innerWinners[boardIndex] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                <span className="text-6xl font-bold text-indigo-600">
                  {innerWinners[boardIndex]}
                </span>
              </div>
            )}
            {/* Inner game board with distinct borders */}
            <div className="grid grid-cols-3 mt-4">
              {board.map((cell, position) => (
                <button
                  key={position}
                  className={`w-10 h-10 bg-white flex items-center justify-center text-lg font-bold hover:bg-gray-50
                    ${position % 3 === 1 ? "border-x-2" : "border-x"}
                    ${Math.floor(position / 3) === 1 ? "border-y-2" : "border-y"}
                    border-gray-300`}
                  onClick={() => handleClick(boardIndex, position)}
                  disabled={
                    game.status !== "playing" ||
                    cell !== "" ||
                    !isValidMove(boardIndex) ||
                    innerWinners[boardIndex] !== ""
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
          <>
            <p>Current turn: {game.currentTurn}</p>
            <p className="text-sm text-gray-600">
              {(game.activeBoard ?? -1) === -1
                ? "Play in any available board"
                : `Must play in board ${(game.activeBoard ?? -1) + 1}`}
            </p>
          </>
        ) : game.status === "won" ? (
          <p className="text-xl font-bold text-indigo-600">
            Winner: {game.winner}
          </p>
        ) : (
          <p className="text-xl font-bold text-gray-600">Draw!</p>
        )}
      </div>
    </div>
  );
}
