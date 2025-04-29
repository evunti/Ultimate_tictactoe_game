import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const removeUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const userToRemove = await ctx.db.get(args.userId);
    if (!userToRemove) throw new Error("User not found");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Current user not found");

    const updatedRemovedUsers = (user.removedUsers || []).concat(args.userId);

    await ctx.db.patch(userId, {
      removedUsers: updatedRemovedUsers,
    });
  },
});
