import {
	integer,
	pgTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	username: varchar("username", { length: 50 }).notNull().unique(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),

	firstName: varchar("first_name", { length: 100 }),
	lastName: varchar("last_name", { length: 100 }),
	street: varchar("street", { length: 200 }),
	houseNumber: varchar("house_number", { length: 20 }),
	postcode: varchar("postcode", { length: 20 }),
	placeOfResidence: varchar("place_of_residence", { length: 100 }),
	phoneNumber: varchar("phone_number", { length: 20 }),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
	id: serial("id").primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	title: varchar("title", { length: 255 }).notNull(),
	mediaUrl: varchar("media_url", { length: 500 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Posts = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
