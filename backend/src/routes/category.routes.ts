import { Router, Request, Response } from 'express';
import { createCategory, CreateCategoryInput, deleteCategory, getCategoriesByUserId, getCategoryById, 
  getCategoryTotalsByUserId, updateCategory, UpdateCategoryInput } from '../functions/category';
import { logDailyExpenditure } from '../functions/budget-workflow';
import { requireSession } from '../middleware/session-auth';

export const categoryRouter = Router();

// create category
// categoryRouter.post('/', async (req: Request, res: Response) => {
//   try {
//     const input : CreateCategoryInput = req.body;
//     if (!input.user_id || !input.name) {
//       return res.status(400).json({error : 'user id and name required'});
//     }

//     const category = await createCategory(input);
//     return res.status(201).json(category);
//   } catch (error) {
//     console.error('Error creating category', error);
//     return res.status(500).json({ error: 'Failed to create category' });
//   }
// });

// Create category V2
categoryRouter.post('/', requireSession, async (req: Request, res: Response) => {
  try {
    const userId = req.authUser!.user_id;
    const input : CreateCategoryInput = req.body;

    if (!input.user_id || !input.name) {
      return res.status(400).json({error : 'user id and name required'});
    }

    const category = await createCategory(input);
    return res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category', error);
    return res.status(500).json({ error: 'Failed to create category' });
  }
});

// get all category totals
// categoryRouter.get('/user/:userId/totals', async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     const totals = await getCategoryTotalsByUserId(userId);
//     return res.json(totals);
//   } catch (error) {
//     return res.status(500).json({ error: 'Failed to get category totals' });
//   }
// })

// get category totals for logged in user V2
categoryRouter.get('/totals', requireSession, async (req: Request, res: Response) => {
  try {
    const userId = req.authUser!.user_id;
    const totals = await getCategoryTotalsByUserId(userId);

    return res.json(totals);

  } catch (error) {
    return res.status(500).json({ error: 'Failed to get category totals' });
  }
});

// get all categories
// categoryRouter.get('/user/:userId', async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     const result = await getCategoriesByUserId(userId);
//     res.status(200).json(result);
//   } catch (error) {
//     console.error('Error getting categories', error);
//     return res.status(500).json({ error: 'Failed to get categories' });
//   }
// });

// get all categories for logged in user V2
categoryRouter.get('/', requireSession, async (req: Request, res: Response) => {
  try {
    const userId = req.authUser!.user_id;

    const result = await getCategoriesByUserId(userId);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error getting categories', error);
    return res.status(500).json({ error: 'Failed to get categories' });
  }
});

// get category by id
categoryRouter.get('/:categoryId', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'No category' });
    }

    return res.json(category);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get category by id' });
  }
});

// update category
categoryRouter.put('/:categoryId', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const input: UpdateCategoryInput = req.body;

    const updatedCategory = await updateCategory(categoryId, input);

    if (!updatedCategory) {
      return res.status(404).json({ error: 'invalid category' });
    }

    return res.json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update category' });
  }
})

// delete category
categoryRouter.delete('/:categoryId', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const deleted = await deleteCategory(categoryId);

    if (!deleted) {
      return res.status(404).json({ error: 'invalid category' });
    }

    return res.json({ message: 'successful deletion' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete category' });
  }
})

// log expenditure for a category
categoryRouter.post('/:categoryId/log-expenditure', requireSession, async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { amount } = req.body as { amount?: number };

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount required' });
    }

    const userId = req.authUser!.user_id;
    const result = await logDailyExpenditure({ userId, categoryId, amount });
    return res.json(result);
  } catch (error) {
    console.error('Error logging expenditure', error);
    return res.status(500).json({ error: 'Failed to log expenditure' });
  }
})
