import { goals } from "./goals";
import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const goalCompletions = pgTable("goal_completions", {
  id: text("id").primaryKey().$defaultFn(createId),
  goalId: text("goal_id")
    .references(() => goals.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type drizzleGoalCompletionsProps = {
  id: string;
  goalId: string;
  createdAt: Date;
};
