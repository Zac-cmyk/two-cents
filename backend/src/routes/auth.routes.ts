import { Router, Request, Response } from 'express';
import { createSession, revokeSessionByToken } from '../functions/session';
import {
	createUser,
	getUserAuthByEmailOrUsername,
	getUserByEmail,
	getUserById,
	getUserByUsername,
} from '../functions/users';
import { getSessionTokenFromRequest, requireSession, sessionCookieName } from '../middleware/session-auth';
import { verifyPassword } from '../utils/password';

export const authRouter = Router();

const sessionTtlDays = Number(process.env.SESSION_TTL_DAYS || 7);
const sessionTtlMs = sessionTtlDays * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === 'production';
const sessionCookieSameSite =
	(process.env.SESSION_COOKIE_SAMESITE as 'lax' | 'strict' | 'none' | undefined) ||
	(isProduction ? 'none' : 'lax');
const sessionCookieSecure = process.env.SESSION_COOKIE_SECURE
	? process.env.SESSION_COOKIE_SECURE === 'true'
	: isProduction || sessionCookieSameSite === 'none';

const setSessionCookie = (res: Response, token: string): void => {
	res.cookie(sessionCookieName, token, {
		httpOnly: true,
		secure: sessionCookieSecure,
		sameSite: sessionCookieSameSite,
		maxAge: sessionTtlMs,
		path: '/',
	});
};

const clearSessionCookie = (res: Response): void => {
	res.clearCookie(sessionCookieName, {
		httpOnly: true,
		secure: sessionCookieSecure,
		sameSite: sessionCookieSameSite,
		path: '/',
	});
};

authRouter.post('/login', async (req: Request, res: Response) => {
	try {
		const { identifier, password } = req.body as { identifier?: string; password?: string };

		if (!identifier || !password) {
			res.status(400).json({ error: 'identifier and password are required' });
			return;
		}

		const userAuth = await getUserAuthByEmailOrUsername(identifier.trim());
		if (!userAuth || !verifyPassword(password, userAuth.password)) {
			res.status(401).json({ error: 'Invalid credentials' });
			return;
		}

		const user = await getUserById(userAuth.user_id);
		if (!user) {
			res.status(404).json({ error: 'User not found' });
			return;
		}

		const session = await createSession(user.user_id, {
			ttlDays: sessionTtlDays,
			userAgent: req.headers['user-agent'] || null,
			ipAddress: req.ip || null,
		});

		setSessionCookie(res, session.sessionToken);
		res.status(200).json({
			message: 'Login successful',
			user,
			session: {
				session_id: session.sessionId,
				expires_at: session.expiresAt,
			},
		});
	} catch (error) {
		console.error('Login failed', error);
		res.status(500).json({ error: 'Login failed' });
	}
});

authRouter.post('/register', async (req: Request, res: Response) => {
	try {
		const {
			email,
			username,
			name,
			password,
			profile_picture,
		} = req.body as {
			email?: string;
			username?: string;
			name?: string;
			password?: string;
			profile_picture?: string | null;
		};

		if (!email || !username || !name || !password) {
			res.status(400).json({ error: 'email, username, name and password are required' });
			return;
		}

		if (password.length < 8) {
			res.status(400).json({ error: 'Password must be at least 8 characters' });
			return;
		}

		const normalizedEmail = email.trim().toLowerCase();
		const normalizedUsername = username.trim().toLowerCase();

		const existingEmail = await getUserByEmail(normalizedEmail);
		if (existingEmail) {
			res.status(409).json({ error: 'Email already in use' });
			return;
		}

		const existingUsername = await getUserByUsername(normalizedUsername);
		if (existingUsername) {
			res.status(409).json({ error: 'Username already in use' });
			return;
		}

		const user = await createUser({
			email: normalizedEmail,
			username: normalizedUsername,
			name: name.trim(),
			password,
			profile_picture: profile_picture ?? null,
		});

		const session = await createSession(user.user_id, {
			ttlDays: sessionTtlDays,
			userAgent: req.headers['user-agent'] || null,
			ipAddress: req.ip || null,
		});

		setSessionCookie(res, session.sessionToken);
		res.status(201).json({
			message: 'Registration successful',
			user,
			session: {
				session_id: session.sessionId,
				expires_at: session.expiresAt,
			},
		});
	} catch (error) {
		console.error('Registration failed', error);
		res.status(500).json({ error: 'Registration failed' });
	}
});

authRouter.post('/logout', async (req: Request, res: Response) => {
	try {
		const token = getSessionTokenFromRequest(req);
		if (token) {
			await revokeSessionByToken(token);
		}

		clearSessionCookie(res);
		res.status(200).json({ message: 'Logout successful' });
	} catch (error) {
		console.error('Logout failed', error);
		res.status(500).json({ error: 'Logout failed' });
	}
});

authRouter.get('/me', requireSession, async (req: Request, res: Response) => {
	res.status(200).json({ authenticated: true, user: req.authUser });
});

authRouter.post('/google', async (req: Request, res: Response) => {
	try {
		const { idToken } = req.body as { idToken?: string };

		if (!idToken) {
			res.status(400).json({ error: 'idToken is required' });
			return;
		}

		const webApiKey = process.env.FIREBASE_WEB_API_KEY;
		if (!webApiKey) {
			res.status(500).json({ error: 'FIREBASE_WEB_API_KEY is not configured' });
			return;
		}

		const verifyResponse = await fetch(
			`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${webApiKey}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ idToken }),
			}
		);

		const verifyData = (await verifyResponse.json()) as {
			users?: Array<{
				email?: string;
				displayName?: string;
				photoUrl?: string;
			}>;
			error?: { message?: string };
		};

		if (!verifyResponse.ok || !verifyData?.users?.length) {
			const reason = verifyData?.error?.message || 'Invalid Google token';
			res.status(401).json({ error: reason });
			return;
		}

		const googleUser = verifyData.users[0];
		const normalizedEmail = googleUser.email?.trim().toLowerCase();
		if (!normalizedEmail) {
			res.status(400).json({ error: 'Google account email is required' });
			return;
		}

		let user = await getUserByEmail(normalizedEmail);

		if (!user) {
			const baseUsername = (normalizedEmail.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 24) || 'user';
			let usernameCandidate = baseUsername;
			let suffix = 1;

			while (await getUserByUsername(usernameCandidate)) {
				usernameCandidate = `${baseUsername}_${suffix++}`;
			}

			const generatedPassword = `google_${Math.random().toString(36).slice(2)}_${Date.now()}`;

			user = await createUser({
				email: normalizedEmail,
				username: usernameCandidate,
				name: googleUser.displayName?.trim() || usernameCandidate,
				password: generatedPassword,
				profile_picture: googleUser.photoUrl ?? null,
			});
		}

		const session = await createSession(user.user_id, {
			ttlDays: sessionTtlDays,
			userAgent: req.headers['user-agent'] || null,
			ipAddress: req.ip || null,
		});

		setSessionCookie(res, session.sessionToken);
		res.status(200).json({
			message: 'Google login successful',
			user,
			session: {
				session_id: session.sessionId,
				expires_at: session.expiresAt,
			},
		});
	} catch (error) {
		console.error('Google login failed', error);
		res.status(500).json({ error: 'Google login failed' });
	}
});
