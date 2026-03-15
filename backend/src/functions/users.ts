import { execute, query, queryOne } from '../utils';
import { hashPassword } from '../utils/password';

export interface UserRecord {
	user_id: string;
	email: string;
	username: string;
	name: string;
	profile_picture: string | null;
	points: number;
	income: string | null;
	pay_period: number | null;
	last_active_day: string | null;
}

export interface UserAuthRecord {
	user_id: string;
	email: string;
	username: string;
	password: string;
}

export interface CreateUserInput {
	email: string;
	username: string;
	name: string;
	password: string;
	profile_picture?: string | null;
	points?: number;
	income?: number | null;
	pay_period?: number | null;
	last_active_day?: string | null;
}

export interface UpdateUserInput {
	email?: string;
	username?: string;
	name?: string;
	password?: string;
	profile_picture?: string | null;
	points?: number;
	income?: number | null;
	pay_period?: number | null;
	last_active_day?: string | null;
}

const userSelectFields =
	'user_id, email, username, name, profile_picture, points, income, pay_period, last_active_day';

export const createUser = async (input: CreateUserInput): Promise<UserRecord> => {
	const hashedPassword = hashPassword(input.password);

	const row = await queryOne<UserRecord>(
		`INSERT INTO users (email, username, name, password, profile_picture, points, income, pay_period, last_active_day)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		 RETURNING ${userSelectFields}`,
		[
			input.email,
			input.username,
			input.name,
			hashedPassword,
			input.profile_picture ?? null,
			input.points ?? 0,
			input.income ?? 0,
			input.pay_period ?? 0,
			input.last_active_day ?? new Date().toISOString().split('T')[0],
		]
	);

	if (!row) {
		throw new Error('Failed to create user');
	}

	return row;
};

export const getUsers = async (): Promise<UserRecord[]> => {
	return query<UserRecord>(`SELECT ${userSelectFields} FROM users ORDER BY name`);
};

export const getUserById = async (userId: string): Promise<UserRecord | null> => {
	return queryOne<UserRecord>(
		`SELECT ${userSelectFields} FROM users WHERE user_id = $1`,
		[userId]
	);
};

export const getUserByEmail = async (email: string): Promise<UserRecord | null> => {
	return queryOne<UserRecord>(`SELECT ${userSelectFields} FROM users WHERE email = $1`, [email]);
};

export const getUserByUsername = async (username: string): Promise<UserRecord | null> => {
	return queryOne<UserRecord>(`SELECT ${userSelectFields} FROM users WHERE username = $1`, [username]);
};

export const getUserAuthByEmailOrUsername = async (
	identifier: string
): Promise<UserAuthRecord | null> => {
	return queryOne<UserAuthRecord>(
		`SELECT user_id, email, username, password
		 FROM users
		 WHERE email = $1 OR username = $1`,
		[identifier]
	);
};

export const updateUser = async (
	userId: string,
	input: UpdateUserInput
): Promise<UserRecord | null> => {
	const hashedPassword = input.password ? hashPassword(input.password) : null;

	return queryOne<UserRecord>(
		`UPDATE users
		 SET email = COALESCE($2, email),
		     username = COALESCE($3, username),
		     name = COALESCE($4, name),
		     password = COALESCE($5, password),
		     profile_picture = COALESCE($6, profile_picture),
		     points = COALESCE($7, points),
		     income = COALESCE($8, income),
		     pay_period = COALESCE($9, pay_period),
		     last_active_day = COALESCE($10, last_active_day)
		 WHERE user_id = $1
		 RETURNING ${userSelectFields}`,
		[
			userId,
			input.email ?? null,
			input.username ?? null,
			input.name ?? null,
			hashedPassword,
			input.profile_picture ?? null,
			input.points ?? null,
			input.income ?? null,
			input.pay_period ?? null,
			input.last_active_day ?? null,
		]
	);
};

export const addUserPoints = async (
	userId: string,
	pointsDelta: number
): Promise<UserRecord | null> => {
	return queryOne<UserRecord>(
		`UPDATE users
		 SET points = points + $2
		 WHERE user_id = $1
		 RETURNING ${userSelectFields}`,
		[userId, pointsDelta]
	);
};

export const deleteUser = async (userId: string): Promise<boolean> => {
	const affectedRows = await execute('DELETE FROM users WHERE user_id = $1', [userId]);
	return affectedRows > 0;
};
