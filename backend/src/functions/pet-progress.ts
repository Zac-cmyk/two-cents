import { withTransaction } from '../utils';
import { clampHearts, getPetLevel, getPetState } from './pet-status';

interface LockedPetRow {
	pet_id: string;
	user_id: string;
	health: number;
	hearts: number;
	state: string | null;
	experience: number;
	inactivity: number;
	equipped_items: string[];
}

export interface PetProgressSnapshot {
	pet_id: string;
	user_id: string;
	health: number;
	hearts: number;
	state: string;
	experience: number;
	level: number;
	inactivity: number;
	equipped_items: string[];
}

const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10);

const toSnapshot = (pet: LockedPetRow): PetProgressSnapshot => ({
	pet_id: pet.pet_id,
	user_id: pet.user_id,
	health: pet.health,
	hearts: pet.hearts,
	state: getPetState(pet.health, pet.inactivity),
	experience: pet.experience,
	level: getPetLevel(pet.experience),
	inactivity: pet.inactivity,
	equipped_items: pet.equipped_items,
});

export const getPetProgressByUserId = async (userId: string): Promise<PetProgressSnapshot | null> => {
	return withTransaction<PetProgressSnapshot | null>(async (client) => {
		const petResult = await client.query<LockedPetRow>(
			`SELECT pet_id, user_id, health, hearts, state, experience, inactivity, equipped_items
			 FROM pet
			 WHERE user_id = $1
			 FOR UPDATE`,
			[userId]
		);

		const pet = petResult.rows[0];
		if (!pet) {
			return null;
		}

		const normalizedState = getPetState(pet.health, pet.inactivity);
		if (pet.state !== normalizedState) {
			await client.query('UPDATE pet SET state = $2 WHERE pet_id = $1', [pet.pet_id, normalizedState]);
			pet.state = normalizedState;
		}

		return toSnapshot(pet);
	});
};

export const interactWithPet = async (
	userId: string,
	input: { affection?: number; feed?: number }
): Promise<PetProgressSnapshot> => {
	const affection = Math.max(0, Math.floor(input.affection ?? 1));
	const feed = Math.max(0, Math.floor(input.feed ?? 0));

	return withTransaction<PetProgressSnapshot>(async (client) => {
		const petResult = await client.query<LockedPetRow>(
			`SELECT pet_id, user_id, health, hearts, state, experience, inactivity, equipped_items
			 FROM pet
			 WHERE user_id = $1
			 FOR UPDATE`,
			[userId]
		);

		const pet = petResult.rows[0];
		if (!pet) {
			throw new Error('Pet not found');
		}

		const activityBoost = affection + feed;
		const nextInactivity = Math.max(0, pet.inactivity - Math.max(1, activityBoost));
		const heartsAfterCare = clampHearts(pet.hearts + activityBoost);
		const nextHealth = Math.min(100, pet.health + feed * 5);
		const nextState = getPetState(nextHealth, nextInactivity);

		await client.query(
			`UPDATE pet
			 SET health = $2,
			     hearts = $3,
			     inactivity = $4,
			     state = $5
			 WHERE pet_id = $1`,
			[pet.pet_id, nextHealth, heartsAfterCare, nextInactivity, nextState]
		);

		await client.query('UPDATE users SET last_active_day = $2 WHERE user_id = $1', [userId, toDateOnly(new Date())]);

		return {
			...pet,
			health: nextHealth,
			hearts: heartsAfterCare,
			inactivity: nextInactivity,
			state: nextState,
			level: getPetLevel(pet.experience),
		};
	});
};

export const applyPetInactivity = async (
	userId: string,
	inactiveDays: number
): Promise<PetProgressSnapshot> => {
	const days = Math.max(0, Math.floor(inactiveDays));

	return withTransaction<PetProgressSnapshot>(async (client) => {
		const petResult = await client.query<LockedPetRow>(
			`SELECT pet_id, user_id, health, hearts, state, experience, inactivity, equipped_items
			 FROM pet
			 WHERE user_id = $1
			 FOR UPDATE`,
			[userId]
		);

		const pet = petResult.rows[0];
		if (!pet) {
			throw new Error('Pet not found');
		}

		const nextInactivity = pet.inactivity + days;
		const nextHearts = clampHearts(pet.hearts - days);
		const nextState = getPetState(pet.health, nextInactivity);

		await client.query(
			`UPDATE pet
			 SET hearts = $2,
			     inactivity = $3,
			     state = $4
			 WHERE pet_id = $1`,
			[pet.pet_id, nextHearts, nextInactivity, nextState]
		);

		return {
			...pet,
			hearts: nextHearts,
			inactivity: nextInactivity,
			state: nextState,
			level: getPetLevel(pet.experience),
		};
	});
};