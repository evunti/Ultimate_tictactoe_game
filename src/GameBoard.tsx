import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { makeMove, resetGame } from "./gameSlice";

export function GameBoard() {
  const game = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h1 className="text-3xl accent-text mt-4">Current Game: </h1>
      <div className="relative">
        {/* Board area with overlay wrapper */}
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
          {/* Overlay for whole board when game is won */}
          {game.status === "won" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl z-30 pointer-events-none">
              <span
                className={`font-bold ${game.currentTurn === "X" ? "text-red-500" : "text-blue-600"} w-full h-full flex items-center justify-center text-[40vw] sm:text-[22vw] md:text-[16vw] lg:text-[13vw] xl:text-[11vw] 2xl:text-[9vw] leading-none select-none`}
              >
                {game.currentTurn === "X" ? "O" : "X"}
              </span>
            </div>
          )}
          {/* Main board grid */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 sm:p-4 bg-gray-100 rounded-xl w-full">
            {game.boards.map((board, boardIndex) => (
              <div key={boardIndex} className="flex flex-col items-center">
                {/* Board label, now outside the mini board box */}
                <div className="mb-1 text-xs sm:text-sm text-gray-500 font-medium">
                  Board {boardIndex + 1}
                </div>
                <div
                  className={`relative aspect-square flex flex-col ${
                    game.activeBoard === -1 || game.activeBoard === boardIndex
                      ? "bg-white"
                      : "bg-gray-50"
                  } p-1 sm:p-2 rounded-lg border-2 border-gray-300 w-full`}
                  style={{ minWidth: 0 }}
                >
                  {/* Winner overlay, covers the mini board */}
                  {game.innerWinners[boardIndex] && (
                    <>
                      {/* Gray out the mini board background */}
                      <div className="absolute inset-0 bg-gray-200 opacity-50 rounded-lg z-10" />
                      {/* Winner mark overlay */}
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <span
                          className={`font-bold ${game.innerWinners[boardIndex] === "X" ? "text-blue-600" : "text-red-500"} select-none text-[22vw] sm:text-[12vw] md:text-[8vw] lg:text-[6vw] xl:text-[10vw] 2xl:text-[4vw]`}
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            lineHeight: 1,
                            textAlign: "center",
                            overflow: "hidden",
                          }}
                        >
                          {game.innerWinners[boardIndex]}
                        </span>
                      </div>
                    </>
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
                          className={`w-7 h-7 sm:w-10 sm:h-10 bg-white flex items-center justify-center text-base sm:text-lg font-bold hover:bg-indigo-50 transition-colors duration-150
                            ${cell === "X" ? "text-blue-600" : cell === "O" ? "text-red-500" : ""}`}
                          style={{ boxSizing: "border-box" }}
                          onClick={() =>
                            dispatch(makeMove({ boardIndex, position }))
                          }
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
