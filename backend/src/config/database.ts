import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const getMissingConfigKeys = (): string[] => {
	if (process.env.DATABASE_URL) {
		return [];
	}

	const requiredKeys = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
	return requiredKeys.filter((key) => !process.env[key]);
};

const poolConfig: PoolConfig = process.env.DATABASE_URL
	? {
			connectionString: process.env.DATABASE_URL,
			ssl:
				process.env.DB_SSL === 'true'
					? {
							rejectUnauthorized: false,
						}
					: false,
		}
	: {
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT || 5432),
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			ssl: { rejectUnauthorized: false },
			max: 10,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 10000,
		};

export const db = new Pool(poolConfig);

export const verifyDatabaseConnection = async (): Promise<void> => {
	const missingKeys = getMissingConfigKeys();
	if (missingKeys.length > 0) {
		throw new Error(
			`Missing database configuration: ${missingKeys.join(', ')}. ` +
				'Set DATABASE_URL or all DB_* variables in backend/.env.'
		);
	}

	const client = await db.connect();
	try {
		await client.query('SELECT 1');
		console.log('[database]: PostgreSQL connection successful');
	} finally {
		client.release();
	}
};

export const closeDatabaseConnection = async (): Promise<void> => {
	await db.end();
};

export const isDatabaseReachable = async (): Promise<boolean> => {
	try {
		await verifyDatabaseConnection();
		return true;
	} catch {
		return false;
	}
};

