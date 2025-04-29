import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { useState } from "react";

// Define the checkWinner function directly in this file
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

export function GameBoard({
  gameId,
  isLocalPlay,
}: {
  gameId?: Id<"games">;
  isLocalPlay?: boolean;
}) {
  const [localGame, setLocalGame] = useState({
    boards: Array(9)
      .fill(null)
      .map(() => Array(9).fill("")),
    currentTurn: "X",
    activeBoard: -1,
    innerWinners: Array(9).fill(""),
    status: "playing",
  });

  const handleLocalMove = (boardIndex: number, position: number) => {
    if (localGame.status !== "playing") return;

    const boards = localGame.boards.map((board, index) =>
      index === boardIndex
        ? board.map((cell, pos) =>
            pos === position ? localGame.currentTurn : cell
          )
        : board
    );

    const innerWinner = checkWinner(boards[boardIndex]);
    const innerWinners = [...localGame.innerWinners];
    if (innerWinner) {
      innerWinners[boardIndex] = innerWinner;
    }

    const winner = checkWinner(innerWinners);
    const isDraw = !winner && innerWinners.every((w) => w !== "");

    let nextActiveBoard = position;
    if (innerWinners[nextActiveBoard] !== "") {
      nextActiveBoard = -1;
    }

    setLocalGame({
      boards,
      currentTurn: localGame.currentTurn === "X" ? "O" : "X",
      activeBoard: nextActiveBoard,
      innerWinners,
      status: winner ? "won" : isDraw ? "draw" : "playing",
    });
  };

  if (isLocalPlay) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-3 gap-2 p-4 bg-gray-100 rounded-xl">
          {localGame.boards.map((board, boardIndex) => (
            <div
              key={boardIndex}
              className={`relative ${
                localGame.activeBoard === -1 ||
                localGame.activeBoard === boardIndex
                  ? "bg-white"
                  : "bg-gray-50"
              } p-2 rounded-lg border-2 border-gray-300`}
            >
              <div className="grid grid-cols-3 mt-4">
                {board.map((cell, position) => (
                  <button
                    key={position}
                    className="w-10 h-10 bg-white flex items-center justify-center text-lg font-bold hover:bg-gray-50 border border-gray-300"
                    onClick={() => handleLocalMove(boardIndex, position)}
                    disabled={
                      cell !== "" ||
                      (localGame.activeBoard !== -1 &&
                        localGame.activeBoard !== boardIndex)
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
          {localGame.status === "playing" ? (
            <p>Current turn: {localGame.currentTurn}</p>
          ) : localGame.status === "won" ? (
            <p className="text-xl font-bold text-indigo-600">
              Winner: {localGame.currentTurn === "X" ? "O" : "X"}
            </p>
          ) : (
            <p className="text-xl font-bold text-gray-600">Draw!</p>
          )}
        </div>
      </div>
    );
  }

  const game = useQuery(api.games.getGame, { gameId: gameId! });
  const makeMove = useMutation(api.games.makeMove);
  const deleteGame = useMutation(api.games.deleteGame);

  if (!game) return null;

  const handleClick = async (boardIndex: number, position: number) => {
    try {
      await makeMove({ gameId: gameId!, boardIndex, position });
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleDeleteGame = async () => {
    try {
      await deleteGame({ gameId: gameId! });
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
      {/* Remove Game Button */}
      <button
        className="mt-4 px-4 py-2 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white"
        onClick={handleDeleteGame}
      >
        Remove Game
      </button>
    </div>
  );
}
