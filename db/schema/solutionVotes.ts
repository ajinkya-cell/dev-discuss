import {
  pgTable,
  uuid,
  timestamp,
  unique
} from "drizzle-orm/pg-core";

import { users } from "./users";
import { solutions } from "./solutions";

export const solutionVotes = pgTable(
  "solution_votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),

    solutionId: uuid("solution_id")
      .references(() => solutions.id)
      .notNull(),

    createdAt: timestamp("created_at").defaultNow()
  },
  (table) => ({
    uniqueVote: unique().on(table.userId, table.solutionId)
  })
);