import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createGame = mutation({
  args: {
    otherPlayerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Create 9 empty boards
    const emptyBoard = Array(9).fill("");
    const boards = Array(9)
      .fill(null)
      .map(() => [...emptyBoard]);

    return await ctx.db.insert("games", {
      boards,
      playerX: userId,
      playerO: args.otherPlayerId,
      currentTurn: "X",
      activeBoard: -1, // -1 means any board can be played
      innerWinners: Array(9).fill(""),
      status: "playing",
    });
  },
});

export const makeMove = mutation({
  args: {
    gameId: v.id("games"),
    boardIndex: v.number(),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");
    if (game.status !== "playing") throw new Error("Game is over");

    const isPlayerX = game.playerX === userId;
    const isPlayerO = game.playerO === userId;
    if (!isPlayerX && !isPlayerO) throw new Error("Not a player in this game");

    const currentPlayer = game.currentTurn;
    if (
      (currentPlayer === "X" && !isPlayerX) ||
      (currentPlayer === "O" && !isPlayerO)
    ) {
      throw new Error("Not your turn");
    }

    // Initialize boards and innerWinners if they don't exist
    const boards =
      game.boards ??
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(""));
    const innerWinners = game.innerWinners ?? Array(9).fill("");
    const activeBoard = game.activeBoard ?? -1;

    // Validate board selection
    if (activeBoard !== -1 && activeBoard !== args.boardIndex) {
      throw new Error("Must play in the active board");
    }

    // Check if the selected board is already won
    if (innerWinners[args.boardIndex] !== "") {
      throw new Error("This board is already completed");
    }

    // Check if the position is already taken
    if (boards[args.boardIndex][args.position] !== "") {
      throw new Error("Position already taken");
    }

    // Make the move
    const newBoards = boards.map((board, index) =>
      index === args.boardIndex
        ? board.map((cell, pos) =>
            pos === args.position ? currentPlayer : cell
          )
        : board
    );

    // Check if this move won the inner board
    const newInnerWinners = [...innerWinners];
    const innerWinner = checkWinner(newBoards[args.boardIndex]);
    if (innerWinner) {
      newInnerWinners[args.boardIndex] = innerWinner;
    }

    // Check if this move won the game
    const winner = checkWinner(newInnerWinners);
    const isDraw = !winner && newInnerWinners.every((w) => w !== "");

    // The next active board is determined by the position played
    // If that board is already won, allow play in any board
    let nextActiveBoard = args.position;
    if (newInnerWinners[nextActiveBoard] !== "") {
      nextActiveBoard = -1;
    }

    await ctx.db.patch(args.gameId, {
      boards: newBoards,
      currentTurn: currentPlayer === "X" ? "O" : "X",
      activeBoard: nextActiveBoard,
      innerWinners: newInnerWinners,
      status: winner ? "won" : isDraw ? "draw" : "playing",
      winner: winner || undefined,
    });
  },
});

export const deleteGame = mutation({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    const isPlayerX = game.playerX === userId;
    const isPlayerO = game.playerO === userId;
    if (!isPlayerX && !isPlayerO) throw new Error("Not a player in this game");

    await ctx.db.delete(args.gameId);
  },
});

export const getGame = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});

export const listGames = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("games")
      .filter((q) =>
        q.or(q.eq(q.field("playerX"), userId), q.eq(q.field("playerO"), userId))
      )
      .collect();
  },
});

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
