import { Request, Response, Router } from 'express';
import { createPetForUser, getPetByUserId, updatePetByUserId } from '../functions';
import { requireSession } from '../middleware/session-auth';
import { applyPetInactivity, getPetProgressByUserId, interactWithPet } from '../functions/pet-progress';

export const petRouter = Router();

petRouter.get('/me', requireSession, async (req: Request, res: Response) => {
	try {
		const userId = req.authUser?.user_id;
		if (!userId) {
			res.status(401).json({ error: 'Authentication required' });
			return;
		}

		const pet = await getPetByUserId(userId);
		if (!pet) {
			res.status(404).json({ error: 'Pet not found' });
			return;
		}

		res.json(pet);
	} catch (error) {
		console.error('Failed to fetch pet', error);
		res.status(500).json({ error: 'Failed to fetch pet' });
	}
});

petRouter.get('/me/progress', requireSession, async (req: Request, res: Response) => {
	try {
		const userId = req.authUser?.user_id;
		if (!userId) {
			res.status(401).json({ error: 'Authentication required' });
			return;
		}

		const pet = await getPetProgressByUserId(userId);
		if (!pet) {
			res.status(404).json({ error: 'Pet not found' });
			return;
		}

		res.json(pet);
	} catch (error) {
		console.error('Failed to fetch pet progress', error);
		res.status(500).json({ error: 'Failed to fetch pet progress' });
	}
});

petRouter.post('/me', requireSession, async (req: Request, res: Response) => {
	try {
		const userId = req.authUser?.user_id;
		if (!userId) {
			res.status(401).json({ error: 'Authentication required' });
			return;
		}

		const existing = await getPetByUserId(userId);
		if (existing) {
			res.status(409).json({ error: 'Pet already exists for user' });
			return;
		}

		const { health, hearts, state, experience, inactivity, equipped_items } = req.body as {
			health?: number;
			hearts?: number;
			state?: string | null;
			experience?: number;
			inactivity?: number;
			equipped_items?: string[];
		};

		const pet = await createPetForUser({
			user_id: userId,
			health,
			hearts,
			state,
			experience,
			inactivity,
			equipped_items,
		});

		res.status(201).json(pet);
	} catch (error) {
		console.error('Failed to create pet', error);
		res.status(500).json({ error: 'Failed to create pet' });
	}
});

petRouter.put('/me', requireSession, async (req: Request, res: Response) => {
	try {
		const userId = req.authUser?.user_id;
		if (!userId) {
			res.status(401).json({ error: 'Authentication required' });
			return;
		}

		const { health, hearts, state, experience, inactivity, equipped_items } = req.body as {
			health?: number;
			hearts?: number;
			state?: string | null;
			experience?: number;
			inactivity?: number;
			equipped_items?: string[];
		};

		const updated = await updatePetByUserId(userId, {
			health,
			hearts,
			state,
			experience,
			inactivity,
			equipped_items,
		});

		if (!updated) {
			res.status(404).json({ error: 'Pet not found' });
			return;
		}

		res.json(updated);
	} catch (error) {
		console.error('Failed to update pet', error);
		res.status(500).json({ error: 'Failed to update pet' });
	}
});

petRouter.post('/me/interact', requireSession, async (req: Request, res: Response) => {
	try {
		const userId = req.authUser?.user_id;
		if (!userId) {
			res.status(401).json({ error: 'Authentication required' });
			return;
		}

		const { affection, feed } = req.body as { affection?: number; feed?: number };
		const updated = await interactWithPet(userId, { affection, feed });
		res.json(updated);
	} catch (error) {
		console.error('Failed to interact with pet', error);
		if (error instanceof Error) {
			res.status(400).json({ error: error.message });
			return;
		}
		res.status(500).json({ error: 'Failed to interact with pet' });
	}
});

petRouter.post('/me/inactivity', requireSession, async (req: Request, res: Response) => {
	try {
		const userId = req.authUser?.user_id;
		if (!userId) {
			res.status(401).json({ error: 'Authentication required' });
			return;
		}

		const { inactive_days } = req.body as { inactive_days?: number };
		if (inactive_days === undefined || inactive_days < 0) {
			res.status(400).json({ error: 'inactive_days must be a non-negative number' });
			return;
		}

		const updated = await applyPetInactivity(userId, inactive_days);
		res.json(updated);
	} catch (error) {
		console.error('Failed to apply pet inactivity', error);
		if (error instanceof Error) {
			res.status(400).json({ error: error.message });
			return;
		}
		res.status(500).json({ error: 'Failed to apply pet inactivity' });
	}
});
