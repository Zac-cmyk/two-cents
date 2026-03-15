import { createHash, randomBytes } from 'node:crypto';
import { execute, queryOne } from '../utils';

export interface SessionUser {
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

interface SessionLookupRow extends SessionUser {
	session_id: string;
	expires_at: Date;
}

export interface SessionLookupResult {
	session_id: string;
	expires_at: Date;
	user: SessionUser;
}

const getSessionTokenHash = (token: string): string => {
	return createHash('sha256').update(token).digest('hex');
};

export const createSession = async (
	userId: string,
	options?: { ttlDays?: number; userAgent?: string | null; ipAddress?: string | null }
): Promise<{ sessionToken: string; sessionId: string; expiresAt: Date }> => {
	const sessionToken = randomBytes(48).toString('base64url');
	const tokenHash = getSessionTokenHash(sessionToken);
	const ttlDays = options?.ttlDays ?? Number(process.env.SESSION_TTL_DAYS || 7);
	const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

	const row = await queryOne<{ session_id: string }>(
		`INSERT INTO user_session (user_id, token_hash, expires_at, user_agent, ip_address)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING session_id`,
		[userId, tokenHash, expiresAt, options?.userAgent ?? null, options?.ipAddress ?? null]
	);

	if (!row) {
		throw new Error('Failed to create session');
	}

	return {
		sessionToken,
		sessionId: row.session_id,
		expiresAt,
	};
};

export const getSessionByToken = async (
	sessionToken: string
): Promise<SessionLookupResult | null> => {
	const tokenHash = getSessionTokenHash(sessionToken);
	const row = await queryOne<SessionLookupRow>(
		`SELECT
			s.session_id,
			s.expires_at,
			u.user_id,
			u.email,
			u.username,
			u.name,
			u.profile_picture,
			u.points,
			u.income,
			u.pay_period,
			u.last_active_day
		 FROM user_session s
		 INNER JOIN users u ON u.user_id = s.user_id
		 WHERE s.token_hash = $1
		   AND s.revoked_at IS NULL
		   AND s.expires_at > NOW()`,
		[tokenHash]
	);

	if (!row) {
		return null;
	}

	return {
		session_id: row.session_id,
		expires_at: row.expires_at,
		user: {
			user_id: row.user_id,
			email: row.email,
			username: row.username,
			name: row.name,
			profile_picture: row.profile_picture,
			points: row.points,
			income: row.income,
			pay_period: row.pay_period,
			last_active_day: row.last_active_day,
		},
	};
};

export const revokeSessionByToken = async (sessionToken: string): Promise<boolean> => {
	const tokenHash = getSessionTokenHash(sessionToken);
	const affectedRows = await execute(
		`UPDATE user_session
		 SET revoked_at = NOW()
		 WHERE token_hash = $1
		   AND revoked_at IS NULL`,
		[tokenHash]
	);

	return affectedRows > 0;
};

export const revokeAllSessionsForUser = async (userId: string): Promise<number> => {
	return execute(
		`UPDATE user_session
		 SET revoked_at = NOW()
		 WHERE user_id = $1
		   AND revoked_at IS NULL`,
		[userId]
	);
};
