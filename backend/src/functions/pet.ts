import { execute, queryOne } from '../utils';

export interface PetRecord {
	pet_id: string;
	user_id: string;
	name: string | null;
	health: number;
	hearts: number;
	state: string | null;
	experience: number;
	inactivity: number;
	equipped_items: string[];
}

export interface CreatePetInput {
	user_id: string;
	name?: string | null;
	health?: number;
	hearts?: number;
	state?: string | null;
	experience?: number;
	inactivity?: number;
	equipped_items?: string[];
}

export interface UpdatePetInput {
	name?: string | null;
	health?: number;
	hearts?: number;
	state?: string | null;
	experience?: number;
	inactivity?: number;
	equipped_items?: string[];
}

const petSelectFields =
	'pet_id, user_id, name, health, hearts, state, experience, inactivity, equipped_items';

export const createPetForUser = async (input: CreatePetInput): Promise<PetRecord> => {
	const row = await queryOne<PetRecord>(
		`INSERT INTO pet (user_id, name, health, hearts, state, experience, inactivity, equipped_items)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
		 RETURNING ${petSelectFields}`,
		[
			input.user_id,
			input.name ?? 'Pet',
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
		 SET name = COALESCE($2, name),
		     health = COALESCE($3, health),
		     hearts = COALESCE($4, hearts),
		     state = COALESCE($5, state),
		     experience = COALESCE($6, experience),
		     inactivity = COALESCE($7, inactivity),
		     equipped_items = COALESCE($8::jsonb, equipped_items)
		 WHERE user_id = $1
		 RETURNING ${petSelectFields}`,
		[
			userId,
			input.name ?? null,
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
