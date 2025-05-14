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

export function GameBoard() {
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

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-3xl  accent-text mt-4">Current Game: </h1>
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
            {/* Add board label and winner */}
            <div className="absolute top-0 left-0 p-1 text-xs text-gray-500">
              Board {boardIndex + 1}
            </div>
            {localGame.innerWinners[boardIndex] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                <span className="text-6xl font-bold text-indigo-600">
                  {localGame.innerWinners[boardIndex]}
                </span>
              </div>
            )}
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
          <p>
            Current turn: {localGame.currentTurn}.{" "}
            {localGame.activeBoard === -1
              ? "You can play in any board."
              : `Play in board ${localGame.activeBoard + 1}.`}
          </p>
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
