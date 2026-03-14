import { execute, queryOne } from '../utils';

export interface PetRecord {
	pet_id: string;
	user_id: string;
	health: number;
	hearts: number;
	state: string | null;
	experience: number;
	inactivity: number;
	equipped_items: string[];
}

export interface CreatePetInput {
	user_id: string;
	health?: number;
	hearts?: number;
	state?: string | null;
	experience?: number;
	inactivity?: number;
	equipped_items?: string[];
}

export interface UpdatePetInput {
	health?: number;
	hearts?: number;
	state?: string | null;
	experience?: number;
	inactivity?: number;
	equipped_items?: string[];
}

const petSelectFields =
	'pet_id, user_id, health, hearts, state, experience, inactivity, equipped_items';

export const createPetForUser = async (input: CreatePetInput): Promise<PetRecord> => {
	const row = await queryOne<PetRecord>(
		`INSERT INTO pet (user_id, health, hearts, state, experience, inactivity, equipped_items)
		 VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
		 RETURNING ${petSelectFields}`,
		[
			input.user_id,
			input.health ?? 100,
			input.hearts ?? 3,
			input.state ?? null,
			input.experience ?? 0,
			input.inactivity ?? 0,
			JSON.stringify(input.equipped_items ?? []),
		]
	);

	if (!row) {
		throw new Error('Failed to create pet');
	}

	return row;
};

export const getPetByUserId = async (userId: string): Promise<PetRecord | null> => {
	return queryOne<PetRecord>(`SELECT ${petSelectFields} FROM pet WHERE user_id = $1`, [userId]);
};

export const updatePetByUserId = async (
	userId: string,
	input: UpdatePetInput
): Promise<PetRecord | null> => {
	return queryOne<PetRecord>(
		`UPDATE pet
		 SET health = COALESCE($2, health),
		     hearts = COALESCE($3, hearts),
		     state = COALESCE($4, state),
		     experience = COALESCE($5, experience),
		     inactivity = COALESCE($6, inactivity),
		     equipped_items = COALESCE($7::jsonb, equipped_items)
		 WHERE user_id = $1
		 RETURNING ${petSelectFields}`,
		[
			userId,
			input.health ?? null,
			input.hearts ?? null,
			input.state ?? null,
			input.experience ?? null,
			input.inactivity ?? null,
			input.equipped_items ? JSON.stringify(input.equipped_items) : null,
		]
	);
};

export const deletePetByUserId = async (userId: string): Promise<boolean> => {
	const affectedRows = await execute('DELETE FROM pet WHERE user_id = $1', [userId]);
	return affectedRows > 0;
};
