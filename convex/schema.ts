import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  games: defineTable({
    // Each cell in the outer grid contains its own board
    boards: v.optional(v.array(v.array(v.string()))), // 9 boards, each with 9 cells
    board: v.optional(v.array(v.string())), // For backward compatibility
    playerX: v.id("users"),
    playerO: v.id("users"),
    currentTurn: v.string(),
    // Track which inner board is active (-1 means player can choose any board)
    activeBoard: v.optional(v.number()),
    // Track the winner of each inner board
    innerWinners: v.optional(v.array(v.string())),
    winner: v.optional(v.string()),
    status: v.string(),
  }),
  users: defineTable({
    name: v.optional(v.string()), // Adding name field to the users schema
    // Adding isAnonymous field to the users schema
    isAnonymous: v.optional(v.boolean()),
    // Adding removedUsers property to the users schema
    removedUsers: v.optional(v.array(v.id("users"))),
    email: v.optional(v.string()), // Adding email property to the users schema
    // ...existing user properties...
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
