import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { makeMove, resetGame } from "./gameSlice";

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
        <h1 className="text-5xl font-bold accent-text mb-4">
          Ultimate Tic Tac Toe
        </h1>
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
      <h1 className="text-5xl font-bold accent-text mb-4">
        Ultimate Tic Tac Toe
      </h1>
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
            ))}
          </div>
        </div>
      </div>
      <div className="text-center space-y-2">
        {game.status === "playing" ? (
          <p>
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
