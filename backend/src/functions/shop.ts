import { execute, query, queryOne, withTransaction } from '../utils';

export interface ShopRecord {
	shop_id: string;
	user_id: string;
}

export interface ShopItemRecord {
	item_id: string;
	shop_id: string;
	name: string;
	price_points: number;
	quantity: number;
	cosmetic: boolean;
}

export interface CreateShopItemInput {
	shop_id: string;
	name: string;
	price_points: number;
	quantity?: number;
	cosmetic?: boolean;
}

export interface UpdateShopItemInput {
	name?: string;
	price_points?: number;
	quantity?: number;
	cosmetic?: boolean;
}

export interface PurchaseResult {
	remaining_points: number;
	item: ShopItemRecord;
}

const shopItemSelectFields = 'item_id, shop_id, name, price_points, quantity, cosmetic';
const shopItemSelectFieldsAliased =
	'si.item_id, si.shop_id, si.name, si.price_points, si.quantity, si.cosmetic';

export const createShopForUser = async (userId: string): Promise<ShopRecord> => {
	const row = await queryOne<ShopRecord>(
		'INSERT INTO shop (user_id) VALUES ($1) RETURNING shop_id, user_id',
		[userId]
	);

	if (!row) {
		throw new Error('Failed to create shop');
	}

	return row;
};

export const getShopByUserId = async (userId: string): Promise<ShopRecord | null> => {
	return queryOne<ShopRecord>('SELECT shop_id, user_id FROM shop WHERE user_id = $1', [userId]);
};

export const createShopItem = async (input: CreateShopItemInput): Promise<ShopItemRecord> => {
	const row = await queryOne<ShopItemRecord>(
		`INSERT INTO shop_item (shop_id, name, price_points, quantity, cosmetic)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING ${shopItemSelectFields}`,
		[
			input.shop_id,
			input.name,
			input.price_points,
			input.quantity ?? 0, // start at 0 purchases owned
			input.cosmetic ?? true,
		]
	);

	if (!row) {
		throw new Error('Failed to create shop item');
	}

	return row;
};

export const getShopItemsByShopId = async (shopId: string): Promise<ShopItemRecord[]> => {
	return query<ShopItemRecord>(
		`SELECT ${shopItemSelectFields}
		 FROM shop_item
		 WHERE shop_id = $1
		 ORDER BY name`,
		[shopId]
	);
};

export const getShopItemsByUserId = async (userId: string): Promise<ShopItemRecord[]> => {
	return query<ShopItemRecord>(
		`SELECT ${shopItemSelectFieldsAliased}
		 FROM shop_item si
		 INNER JOIN shop s ON s.shop_id = si.shop_id
		 WHERE s.user_id = $1
		   AND (si.cosmetic = false OR si.quantity = 0)
		 ORDER BY si.name`,
		[userId]
	);
};

export const updateShopItem = async (
	itemId: string,
	input: UpdateShopItemInput
): Promise<ShopItemRecord | null> => {
	return queryOne<ShopItemRecord>(
		`UPDATE shop_item
		 SET name = COALESCE($2, name),
		     price_points = COALESCE($3, price_points),
		     quantity = COALESCE($4, quantity),
		     cosmetic = COALESCE($5, cosmetic)
		 WHERE item_id = $1
		 RETURNING ${shopItemSelectFields}`,
		[
			itemId,
			input.name ?? null,
			input.price_points ?? null,
			input.quantity ?? null,
			input.cosmetic ?? null,
		]
	);
};

export const deleteShopItem = async (itemId: string): Promise<boolean> => {
	const affectedRows = await execute('DELETE FROM shop_item WHERE item_id = $1', [itemId]);
	return affectedRows > 0;
};

export const purchaseShopItem = async (
	userId: string,
	itemId: string
): Promise<PurchaseResult> => {
	return withTransaction<PurchaseResult>(async (client) => {
		const userResult = await client.query<{ points: number }>(
			'SELECT points FROM users WHERE user_id = $1 FOR UPDATE',
			[userId]
		);
		const user = userResult.rows[0];

		if (!user) {
			throw new Error('User not found');
		}

		const itemResult = await client.query<ShopItemRecord>(
			`SELECT ${shopItemSelectFields}
			 FROM shop_item
			 WHERE item_id = $1
			 FOR UPDATE`,
			[itemId]
		);
		const item = itemResult.rows[0];

		if (!item) {
			throw new Error('Item not found');
		}

		if (item.cosmetic && item.quantity > 0) {
			throw new Error('Item is already owned');
		}

		if (user.points < item.price_points) {
			throw new Error('Insufficient points');
		}

		const remainingPoints = user.points - item.price_points;

		await client.query('UPDATE users SET points = $2 WHERE user_id = $1', [userId, remainingPoints]);

		// Increase owned quantity. For cosmetics, this will move from 0 → 1, hiding the item from the shop.
		await client.query('UPDATE shop_item SET quantity = quantity + 1 WHERE item_id = $1', [itemId]);

		const updatedItemResult = await client.query<ShopItemRecord>(
			`SELECT ${shopItemSelectFields}
			 FROM shop_item
			 WHERE item_id = $1`,
			[itemId]
		);

		const updatedItem = updatedItemResult.rows[0];
		if (!updatedItem) {
			throw new Error('Failed to load updated item');
		}

		return {
			remaining_points: remainingPoints,
			item: updatedItem,
		};
	});
};
