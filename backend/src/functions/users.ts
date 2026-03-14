import { execute, query, queryOne } from '../utils';

export interface UserRecord {
	user_id: string;
	email: string;
	name: string;
	points: number;
	income: string | null;
	pay_period: number | null;
	last_active_day: string | null;
}

export interface CreateUserInput {
	email: string;
	name: string;
	points?: number;
	income?: number | null;
	pay_period?: number | null;
	last_active_day?: string | null;
}

export interface UpdateUserInput {
	email?: string;
	name?: string;
	points?: number;
	income?: number | null;
	pay_period?: number | null;
	last_active_day?: string | null;
}

const userSelectFields =
	'user_id, email, name, points, income, pay_period, last_active_day';

export const createUser = async (input: CreateUserInput): Promise<UserRecord> => {
	const row = await queryOne<UserRecord>(
		`INSERT INTO users (email, name, points, income, pay_period, last_active_day)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING ${userSelectFields}`,
		[
			input.email,
			input.name,
			input.points ?? 0,
			input.income ?? null,
			input.pay_period ?? null,
			input.last_active_day ?? null,
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

export const updateUser = async (
	userId: string,
	input: UpdateUserInput
): Promise<UserRecord | null> => {
	return queryOne<UserRecord>(
		`UPDATE users
		 SET email = COALESCE($2, email),
		     name = COALESCE($3, name),
		     points = COALESCE($4, points),
		     income = COALESCE($5, income),
		     pay_period = COALESCE($6, pay_period),
		     last_active_day = COALESCE($7, last_active_day)
		 WHERE user_id = $1
		 RETURNING ${userSelectFields}`,
		[
			userId,
			input.email ?? null,
			input.name ?? null,
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
