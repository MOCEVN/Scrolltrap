import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";

import { getDb } from "./db";
import { users } from "./schema";

export type StoredUser = typeof users.$inferSelect;
export type PublicUser = Omit<StoredUser, "passwordHash" | "createdAt"> & {
	createdAt: string;
};

const toPublicUser = (row: StoredUser): PublicUser => ({
	id: row.id,
	username: row.username,
	email: row.email,
	firstName: row.firstName ?? null,
	lastName: row.lastName ?? null,
	street: row.street ?? null,
	houseNumber: row.houseNumber ?? null,
	postcode: row.postcode ?? null,
	placeOfResidence: row.placeOfResidence ?? null,
	phoneNumber: row.phoneNumber ?? null,
	createdAt:
		row.createdAt instanceof Date
			? row.createdAt.toISOString()
			: new Date(row.createdAt).toISOString(),
});

export const findUserById = async (id: number): Promise<PublicUser | null> => {
	const db = getDb();
	const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);

	if (!row) {
		return null;
	}

	return toPublicUser(row);
};

export const findUserByUsernameOrEmail = async (
	identifier: string,
): Promise<StoredUser | null> => {
	const db = getDb();
	const trimmed = identifier.trim();
	const normalizedEmail = trimmed.toLowerCase();

	const [row] = await db
		.select()
		.from(users)
		.where(or(eq(users.username, trimmed), eq(users.email, normalizedEmail)))
		.limit(1);

	return row ?? null;
};

export const isUsernameTaken = async (username: string): Promise<boolean> => {
	const db = getDb();
	const [row] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.username, username))
		.limit(1);

	return Boolean(row);
};

export const isEmailTaken = async (email: string): Promise<boolean> => {
	const db = getDb();
	const [row] = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.email, email.toLowerCase()))
		.limit(1);

	return Boolean(row);
};

export const createUser = async (input: {
	username: string;
	email: string;
	password: string;
}): Promise<PublicUser> => {
	const db = getDb();

	const passwordHash = await bcrypt.hash(input.password, 12);

	await db.insert(users).values({
		username: input.username,
		email: input.email.toLowerCase(),
		passwordHash,
	});

	const user = await findUserByUsernameOrEmail(input.username);
	if (!user) {
		throw new Error("Failed to read user after insert");
	}

	return toPublicUser(user);
};

export const verifyCredentials = async (
	identifier: string,
	password: string,
): Promise<PublicUser | null> => {
	const user = await findUserByUsernameOrEmail(identifier);

	if (!user) {
		return null;
	}

	const matches = await bcrypt.compare(password, user.passwordHash);

	if (!matches) {
		return null;
	}

	return toPublicUser(user);
};

export const deleteUser = async (id: number): Promise<boolean> => {
	const db = getDb();

	const existing = await findUserById(id);
	if (!existing) return false;

	await db.delete(users).where(eq(users.id, id));

	return true;
};

export const updateUserById = async (
	id: number,
	input: Record<string, string>,
): Promise<PublicUser> => {
	const db = getDb();

	const updateData: Record<string, unknown> = {};

	for (const key in input) {
		const value = input[key];
		if (!value || value.trim() === "") continue;

		// speciaal geval voor password: hashen
		if (key === "password") {
			updateData.passwordHash = await bcrypt.hash(value, 12);
		} else if (key === "email") {
			updateData.email = value.toLowerCase();
		} else if (key === "firstName") {
			updateData.firstName = value;
		} else if (key === "username") {
			updateData.username = value;
		} else if (key === "lastName") {
			updateData.lastName = value;
		} else if (key === "street") {
			updateData.street = value;
		} else if (key === "houseNumber") {
			updateData.houseNumber = value;
		} else if (key === "postcode") {
			updateData.postcode = value;
		} else if (key === "placeOfResidence") {
			updateData.placeOfResidence = value;
		} else if (key === "phoneNumber") {
			updateData.phoneNumber = value;
		}
	}

	if (Object.keys(updateData).length === 0) {
		throw new Error("Nothing to update");
	}

	console.log("📝 Updating user", id, "with data:", updateData);

	await db.update(users).set(updateData).where(eq(users.id, id));

	const updated = await findUserById(id);
	if (!updated) {
		throw new Error("User not found after update");
	}

	return updated;
};
