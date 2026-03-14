import { Router, Request, Response } from 'express';
import {
	createShopForUser,
	getShopByUserId,
	createShopItem,
	getShopItemsByShopId,
	getShopItemsByUserId,
	updateShopItem,
	deleteShopItem,
	purchaseShopItem,
	CreateShopItemInput,
	UpdateShopItemInput,
} from '../functions/shop';

export const shopRouter = Router();

// create a shop
shopRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'invalid user id' });
    }

    const shop = await createShopForUser(userId);
    return res.status(201).json(shop);
  } catch (error) {
    console.error('Error creating shop', error);
    return res.status(500).json({ error: 'Failed to create shop' });
  }
});

// get shop by user id
shopRouter.get('/user/:userId', async (req: Request, res:Response) => {
  try {
    const { userId } = req.params;
    const shop = await getShopByUserId(userId);

    if (!shop) {
      return res.status(401).json({ error: 'shop not found' });
    }

    return res.json(shop);
  } catch (error) {
    return res.status(500).json({ error: 'failed to get shop' });
  }
});

// get all shop items by user id
shopRouter.get('/:shopId/items', async (req: Request, res: Response) => {
	try {
		const { shopId } = req.params;
		const items = await getShopItemsByShopId(shopId);

		return res.json(items);
	} catch (error) {
		return res.status(500).json({ error: 'failed to get shop items' });
	}
});

// create shop item
shopRouter.post('/items', async (req: Request, res: Response) => {
	try {
		const input: CreateShopItemInput = req.body;

		if (!input.shop_id || !input.name || input.price_points === undefined) {
			return res.status(400).json({ error: 'input required' });
		}

		const item = await createShopItem(input);
		return res.status(201).json(item);
	} catch (error) {
		return res.status(500).json({ error: 'failed to create shop item' });
	}
});

// update shop item
shopRouter.put('/items/:itemId', async (req: Request, res: Response) => {
	try {
		const { itemId } = req.params;
		const input: UpdateShopItemInput = req.body;

		const updatedItem = await updateShopItem(itemId, input);

		if (!updatedItem) {
			return res.status(404).json({ error: 'item not found' });
		}

		return res.json(updatedItem);
	} catch (error) {
		return res.status(500).json({ error: 'failed to update shop item' });
	}
});

// delete shop item
shopRouter.delete('/items/:itemId', async (req: Request, res: Response) => {
	try {
		const { itemId } = req.params;
		const deleted = await deleteShopItem(itemId);

		if (!deleted) {
			return res.status(404).json({ error: 'item not found' });
		}

		return res.json({ message: 'shop item deleted successfully' });
	} catch (error) {
		return res.status(500).json({ error: 'failed to delete shop item' });
	}
});

// purchase shop item
shopRouter.post('/purchase', async (req: Request, res: Response) => {
	try {
		const { user_id, item_id } = req.body;

		if (!user_id || !item_id) {
			return res.status(400).json({ error: 'user_id and item_id are required' });
		}

		const result = await purchaseShopItem(user_id, item_id);
		return res.json(result);
	} catch (error) {
		console.error('Error purchasing shop item', error);

		if (error instanceof Error) {
			if (error.message === 'User not found') {
				return res.status(404).json({ error: error.message });
			}
			if (error.message === 'Item not found') {
				return res.status(404).json({ error: error.message });
			}
			if (error.message === 'Item is out of stock') {
				return res.status(400).json({ error: error.message });
			}
			if (error.message === 'Insufficient points') {
				return res.status(400).json({ error: error.message });
			}
		}

		return res.status(500).json({ error: 'Failed to purchase shop item' });
	}
});