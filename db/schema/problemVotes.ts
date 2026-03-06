import { pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { problems } from "./problems";

export const problemVotes = pgTable(
    "problem_votes",{
        id : uuid("id").defaultRandom().primaryKey(),
        userId : uuid("user_id")
         .references(()=>users.id)
         .notNull(),
        problemId : uuid("problem_id")
         .references(()=>problems.id)
          .notNull(),
        createdAt : timestamp("created_at").defaultNow()   
    },
    (table)=>({
        uniqueVote:unique().on(table.userId , table.problemId)
    })
)