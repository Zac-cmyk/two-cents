import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SCRYPT_PREFIX = 'scrypt';

export const hashPassword = (password: string): string => {
	const salt = randomBytes(16).toString('hex');
	const hash = scryptSync(password, salt, 64).toString('hex');
	return `${SCRYPT_PREFIX}:${salt}:${hash}`;
};

export const verifyPassword = (password: string, storedPassword: string): boolean => {
	if (storedPassword.startsWith(`${SCRYPT_PREFIX}:`)) {
		const [, salt, expectedHash] = storedPassword.split(':');
		if (!salt || !expectedHash) {
			return false;
		}

		const computedHash = scryptSync(password, salt, 64).toString('hex');
		return timingSafeEqual(Buffer.from(expectedHash, 'hex'), Buffer.from(computedHash, 'hex'));
	}

	return password === storedPassword;
};
