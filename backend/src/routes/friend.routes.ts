import { Router, Request, Response } from 'express';
import { requireSession } from '../middleware/session-auth';
import { addFriend, getFriendsByUserId, removeFriend } from '../functions/friend';

export const friendRouter = Router();

friendRouter.use(requireSession);

friendRouter.get('/', async (req: Request, res: Response) => {
	try {
		const userId = req.authUser?.user_id;
		if (!userId) {
			return res.status(401).json({ error: 'Authentication required' });
		}

		const friends = await getFriendsByUserId(userId);
		return res.json(friends);
	} catch (error) {
		console.error('Failed to list friends', error);
		return res.status(500).json({ error: 'Failed to list friends' });
	}
});

friendRouter.post('/', async (req: Request, res: Response) => {
	try {
		const userId = req.authUser?.user_id;
		if (!userId) {
			return res.status(401).json({ error: 'Authentication required' });
		}

		const { friend_id } = req.body as { friend_id?: string };
		if (!friend_id) {
			return res.status(400).json({ error: 'friend_id is required' });
		}

		const friend = await addFriend(userId, friend_id);
		return res.status(201).json(friend);
	} catch (error) {
		console.error('Failed to add friend', error);
		return res.status(500).json({ error: (error instanceof Error ? error.message : 'Failed to add friend') });
	}
});

friendRouter.delete('/:friendId', async (req: Request, res: Response) => {
	try {
		const userId = req.authUser?.user_id;
		if (!userId) {
			return res.status(401).json({ error: 'Authentication required' });
		}

		const { friendId } = req.params;
		const removed = await removeFriend(userId, friendId);
		if (!removed) {
			return res.status(404).json({ error: 'Friend relationship not found' });
		}

		return res.json({ message: 'Friend removed' });
	} catch (error) {
		console.error('Failed to remove friend', error);
		return res.status(500).json({ error: 'Failed to remove friend' });
	}
});
