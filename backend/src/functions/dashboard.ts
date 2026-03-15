import { queryOne } from '../utils';

export interface UserBudgetSummary {
	user_id: string;
	name: string;
	income: string | null;
	total_upper_limit: string;
	total_expenditure: string;
	remaining_budget: string;
}

export interface UserProfileBundle {
	user_id: string;
	email: string;
	username: string;
	name: string;
	profile_picture: string | null;
	points: number;
	income: string | null;
	pay_period: number | null;
	last_active_day: string | null;
	pet: {
		pet_id: string;
		health: number;
		hearts: number;
		state: string | null;
		experience: number;
		inactivity: number;
		equipped_items: string[];
	} | null;
	categories: Array<{
		category_id: string;
		name: string;
		percentage: string | null;
		upper_limit: string | null;
		expenditure: string;
		daily_expenses: string;
	}>;
	shop: {
		shop_id: string;
		items: Array<{
			item_id: string;
			name: string;
			price_points: number;
			quantity: number;
			cosmetic: boolean;
		}>;
	} | null;
}

export const getUserBudgetSummary = async (
	userId: string
): Promise<UserBudgetSummary | null> => {
	return queryOne<UserBudgetSummary>(
		`SELECT
			u.user_id,
			u.name,
			u.income,
			COALESCE(SUM(c.upper_limit), 0)::text AS total_upper_limit,
			COALESCE(SUM(c.expenditure), 0)::text AS total_expenditure,
			(COALESCE(SUM(c.upper_limit), 0) - COALESCE(SUM(c.expenditure), 0))::text AS remaining_budget
		 FROM users u
		 LEFT JOIN category c ON c.user_id = u.user_id
		 WHERE u.user_id = $1
		 GROUP BY u.user_id, u.name, u.income`,
		[userId]
	);
};

export const getUserProfileBundle = async (
	userId: string
): Promise<UserProfileBundle | null> => {
	return queryOne<UserProfileBundle>(
		`SELECT
			u.user_id,
			u.email,
			u.username,
			u.name,
			u.profile_picture,
			u.points,
			u.income,
			u.pay_period,
			u.last_active_day,
			(
				SELECT json_build_object(
					'pet_id', p.pet_id,
					'health', p.health,
					'hearts', p.hearts,
					'state', p.state,
					'experience', p.experience,
					'inactivity', p.inactivity,
					'equipped_items', p.equipped_items
				)
				FROM pet p
				WHERE p.user_id = u.user_id
			) AS pet,
			COALESCE(
				(
					SELECT json_agg(
						json_build_object(
							'category_id', c.category_id,
							'name', c.name,
							'percentage', c.percentage,
							'upper_limit', c.upper_limit,
							'expenditure', c.expenditure,
							'daily_expenses', c.daily_expenses
						)
						ORDER BY c.name
					)
					FROM category c
					WHERE c.user_id = u.user_id
				),
				'[]'::json
			) AS categories,
			(
				SELECT json_build_object(
					'shop_id', s.shop_id,
					'items', COALESCE(
						(
							SELECT json_agg(
								json_build_object(
									'item_id', si.item_id,
									'name', si.name,
									'price_points', si.price_points,
									'quantity', si.quantity,
									'cosmetic', si.cosmetic
								)
								ORDER BY si.name
							)
							FROM shop_item si
							WHERE si.shop_id = s.shop_id
						),
						'[]'::json
					)
				)
				FROM shop s
				WHERE s.user_id = u.user_id
			) AS shop
		FROM users u
		WHERE u.user_id = $1`,
		[userId]
	);
};
