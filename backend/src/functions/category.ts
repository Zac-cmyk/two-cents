import { execute, query, queryOne } from '../utils';
import { getUserById } from './users';

const roundMoney = (value: number): number => Math.round(value * 100) / 100;


export interface CategoryRecord {
	category_id: string;
	user_id: string;
	name: string;
	percentage: string | null;
	upper_limit: string | null;
	expenditure: string;
	daily_expenses: string;
}

export interface CategoryTotals {
	total_expenditure: string;
	total_upper_limit: string;
	total_daily_expenses: string;
}

export interface CreateCategoryInput {
	user_id: string;
	name: string;
	percentage?: number | null;
	upper_limit?: number | null;
	expenditure?: number;
	daily_expenses?: number;
}

export interface UpdateCategoryInput {
	name?: string;
	percentage?: number | null;
	upper_limit?: number | null;
	expenditure?: number;
	daily_expenses?: number;
}

const categorySelectFields =
	'category_id, user_id, name, percentage, upper_limit, expenditure, daily_expenses';

export const createCategory = async (input: CreateCategoryInput): Promise<CategoryRecord> => {
	let upperLimit = input.upper_limit;
	let dailyExpenses = input.daily_expenses ?? 0;

	if (input.percentage && !input.upper_limit) {
		const user = await getUserById(input.user_id);
		if (user && user.income && user.pay_period) {
			const income = Number(user.income);
			const payPeriod = Number(user.pay_period);
			if (income > 0 && payPeriod > 0) {
				upperLimit = roundMoney((income * input.percentage) / 100);
				dailyExpenses = roundMoney((upperLimit || 0) / payPeriod);
			}
		}
	}

	const row = await queryOne<CategoryRecord>(
		`INSERT INTO category (user_id, name, percentage, upper_limit, expenditure, daily_expenses)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING ${categorySelectFields}`,
		[
			input.user_id,
			input.name,
			input.percentage ?? null,
			upperLimit ?? null,
			input.expenditure ?? 0,
			dailyExpenses,
		]
	);

	if (!row) {
		throw new Error('Failed to create category');
	}

	return row;
};

export const getCategoriesByUserId = async (userId: string): Promise<CategoryRecord[]> => {
	return query<CategoryRecord>(
		`SELECT ${categorySelectFields} FROM category WHERE user_id = $1 ORDER BY name`,
		[userId]
	);
};

export const getCategoryById = async (categoryId: string): Promise<CategoryRecord | null> => {
	return queryOne<CategoryRecord>(
		`SELECT ${categorySelectFields} FROM category WHERE category_id = $1`,
		[categoryId]
	);
};

export const updateCategory = async (
	categoryId: string,
	input: UpdateCategoryInput
): Promise<CategoryRecord | null> => {
	return queryOne<CategoryRecord>(
		`UPDATE category
		 SET name = COALESCE($2, name),
		     percentage = COALESCE($3, percentage),
		     upper_limit = COALESCE($4, upper_limit),
		     expenditure = COALESCE($5, expenditure),
		     daily_expenses = COALESCE($6, daily_expenses)
		 WHERE category_id = $1
		 RETURNING ${categorySelectFields}`,
		[
			categoryId,
			input.name ?? null,
			input.percentage ?? null,
			input.upper_limit ?? null,
			input.expenditure ?? null,
			input.daily_expenses ?? null,
		]
	);
};

export const deleteCategory = async (categoryId: string): Promise<boolean> => {
	const affectedRows = await execute('DELETE FROM category WHERE category_id = $1', [categoryId]);
	return affectedRows > 0;
};

export const getCategoryTotalsByUserId = async (userId: string): Promise<CategoryTotals | null> => {
	return queryOne<CategoryTotals>(
		`SELECT
			COALESCE(SUM(expenditure), 0)::text AS total_expenditure,
			COALESCE(SUM(upper_limit), 0)::text AS total_upper_limit,
			COALESCE(SUM(daily_expenses), 0)::text AS total_daily_expenses
		 FROM category
		 WHERE user_id = $1`,
		[userId]
	);
};
