export const PET_HEART_MAX = 3;
export const PET_LEVEL_UP_POINTS_REWARD = 20;

export const getPetLevel = (experience: number): number => {
	return Math.max(1, Math.floor(Math.max(0, experience) / 100) + 1);
};

export const getPetState = (health: number, inactivity: number): string => {
	if (health <= 0) {
		return 'dead';
	}

	if (inactivity >= 5) {
		return 'angry';
	}

	if (inactivity >= 2) {
		return 'sad';
	}

	return 'happy';
};

export const clampHearts = (value: number): number => {
	return Math.max(0, Math.min(PET_HEART_MAX, value));
};