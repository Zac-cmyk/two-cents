import { Router, Request, Response } from 'express';
import { requireSession } from "../middleware/session-auth";
import { getUserById, updateUser, UserRecord } from '../functions/users';

export const userRouter = Router();

// Set income
userRouter.put('/income', async (req: Request, res: Response) => {
  const userId = req.authUser!.user_id;
  const { income } = req.body;

  if (income !== null && typeof income !== 'number') {
    return res.status(400).json({ error: 'Income must be a number or null' });
  }

  try {
    const updatedUser: UserRecord | null = await updateUser(userId, { income });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error('Failed to update income:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// set pay_period
userRouter.put('/pay_period', async (req: Request, res: Response) => {
  const userId = req.authUser!.user_id;
  const { pay_period } = req.body;

  if (pay_period !== null && typeof pay_period !== 'number') {
    return res.status(400).json({ error: 'Income must be a number or null' });
  }

  try {
    const updatedUser: UserRecord | null = await updateUser(userId, { pay_period });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error('Failed to update pay period:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// set last active day to current day.
userRouter.put('/active_day', async (req: Request, res: Response) => {
  const userId = req.authUser!.user_id;

  try {
    const updatedUser: UserRecord | null = await updateUser(userId, { last_active_day: new Date().toISOString().split('T')[0] });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error('Failed to update pay period:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// get user details
userRouter.get('/me', async (req: Request, res: Response) => {
  const userId = req.authUser!.user_id;

  try {
    const user: UserRecord | null = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    console.error('Failed to update get user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});