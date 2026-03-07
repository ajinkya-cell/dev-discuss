import { pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const follows = pgTable(
    "follows",{
        id : uuid("id").defaultRandom().primaryKey(),
        followerId : uuid("follower_id")
         .references(()=>users.id)
         .notNull(),
        followingId : uuid("following_id")
         .references(()=>users.id)
         .notNull(),
        createdAt : timestamp("created_at").defaultNow()  
    },
    (table)=>({
        uniqueFollow:unique().on(table.followerId , table.followingId)     
    })
)