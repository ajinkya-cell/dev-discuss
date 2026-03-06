import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { problems } from "./problems";
import { users } from "./users";

export const solutions = pgTable("solutions" ,{
    id:uuid("id").defaultRandom().primaryKey(),
    content : text("content").notNull(),
    problemId : uuid("problem_id")
     .references(() => problems.id)
     .notNull(),
     authorId :uuid("author_id")
      .references(()=>users.id)
      .notNull(),
    createdAt:timestamp("created_at").defaultNow(),
    updatedAt:timestamp("updated_at").defaultNow() 
})