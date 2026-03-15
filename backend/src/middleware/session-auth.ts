import { NextFunction, Request, Response } from 'express';
import { getSessionByToken, SessionUser } from '../functions/session';

export const sessionCookieName = process.env.SESSION_COOKIE_NAME || 'two_cents_session';

const parseCookies = (cookieHeader?: string): Record<string, string> => {
	if (!cookieHeader) {
		return {};
	}

	return cookieHeader.split(';').reduce<Record<string, string>>((all, pair) => {
		const [rawKey, ...rest] = pair.trim().split('=');
		if (!rawKey || rest.length === 0) {
			return all;
		}

		all[rawKey] = decodeURIComponent(rest.join('='));
		return all;
	}, {});
};

export const getSessionTokenFromRequest = (req: Request): string | null => {
	const cookies = parseCookies(req.headers.cookie);
	return cookies[sessionCookieName] ?? null;
};

declare global {
	namespace Express {
		interface Request {
			authUser?: SessionUser;
			authSessionId?: string;
		}
	}
}

export const requireSession = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const token = getSessionTokenFromRequest(req);
	if (!token) {
		res.status(401).json({ error: 'Authentication required' });
		return;
	}

	const session = await getSessionByToken(token);
	if (!session) {
		res.status(401).json({ error: 'Session is invalid or expired' });
		return;
	}

	req.authUser = session.user;
	req.authSessionId = session.session_id;
	next();
};
