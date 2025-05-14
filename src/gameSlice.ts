import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameState = {
  boards: string[][];
  currentTurn: "X" | "O";
  activeBoard: number;
  innerWinners: string[];
  status: "playing" | "won" | "draw";
};

const initialState: GameState = {
  boards: Array(9)
    .fill(null)
    .map(() => Array(9).fill("")),
  currentTurn: "X",
  activeBoard: -1,
  innerWinners: Array(9).fill(""),
  status: "playing",
};

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

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    makeMove: (
      state,
      action: PayloadAction<{ boardIndex: number; position: number }>
    ) => {
      if (state.status !== "playing") return;
      const { boardIndex, position } = action.payload;
      if (state.boards[boardIndex][position] !== "") return;
      if (state.activeBoard !== -1 && state.activeBoard !== boardIndex) return;
      state.boards[boardIndex][position] = state.currentTurn;
      const innerWinner = checkWinner(state.boards[boardIndex]);
      if (innerWinner) {
        state.innerWinners[boardIndex] = innerWinner;
      }
      const winner = checkWinner(state.innerWinners);
      const isDraw = !winner && state.innerWinners.every((w) => w !== "");
      let nextActiveBoard = position;
      if (state.innerWinners[nextActiveBoard] !== "") {
        nextActiveBoard = -1;
      }
      state.currentTurn = state.currentTurn === "X" ? "O" : "X";
      state.activeBoard = nextActiveBoard;
      state.status = winner ? "won" : isDraw ? "draw" : "playing";
    },
    resetGame: () => initialState,
  },
});

export const { makeMove, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
