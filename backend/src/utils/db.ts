import { PoolClient, QueryResultRow } from 'pg';
import { db } from '../config/database';

export type QueryParams = unknown[];

export const query = async <T extends QueryResultRow>(
	text: string,
	params: QueryParams = []
): Promise<T[]> => {
	const result = await db.query<T>(text, params);
	return result.rows;
};

export const queryOne = async <T extends QueryResultRow>(
	text: string,
	params: QueryParams = []
): Promise<T | null> => {
	const rows = await query<T>(text, params);
	return rows[0] ?? null;
};

export const execute = async (
	text: string,
	params: QueryParams = []
): Promise<number> => {
	const result = await db.query(text, params);
	return result.rowCount ?? 0;
};

export const withTransaction = async <T>(
	runner: (client: PoolClient) => Promise<T>
): Promise<T> => {
	const client = await db.connect();

	try {
		await client.query('BEGIN');
		const result = await runner(client);
		await client.query('COMMIT');
		return result;
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
};
