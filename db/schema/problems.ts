import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";


export const problems = pgTable("problems" , {
    id : uuid("id").defaultRandom().primaryKey(),
    title : varchar("title" , { length : 255}).notNull(),
    description : text("description").notNull(),
    tags : text("tags").array().notNull(),
    authorId : uuid("author_id")
     .references(()=>users.id)
     .notNull(),
    createdAt : timestamp("created_at").defaultNow(),
    updatedAt : timestamp("updated_at").defaultNow() 
})