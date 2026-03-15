import { withTransaction } from '../utils';
import {
	clampHearts,
	getPetLevel,
	getPetState,
	PET_HEART_MAX,
	PET_LEVEL_UP_POINTS_REWARD,
} from './pet-status';

interface LockedUserRow {
	user_id: string;
	income: string | null;
	pay_period: number | null;
	last_active_day: string | null;
	points: number;
}

interface LockedCategoryRow {
	category_id: string;
	user_id: string;
	name: string;
	percentage: string | null;
	upper_limit: string | null;
	expenditure: string;
	daily_expenses: string;
}

interface LockedPetRow {
	pet_id: string;
	health: number;
	hearts: number;
	state: string | null;
	experience: number;
	inactivity: number;
}

export interface BudgetSplitInput {
	category_id?: string;
	name?: string;
	percentage: number;
}

export interface ApplyBudgetConfigInput {
	userId: string;
	income: number;
	payPeriod: number;
	splits: BudgetSplitInput[];
}

export interface UpdatedBudgetCategory {
	category_id: string;
	name: string;
	percentage: string | null;
	upper_limit: string | null;
	expenditure: string;
	daily_expenses: string;
}

export interface ApplyBudgetConfigResult {
	user_id: string;
	income: number;
	pay_period: number;
	categories: UpdatedBudgetCategory[];
}

export interface LogDailyExpenditureInput {
	userId: string;
	categoryId: string;
	amount: number;
}

export interface LogDailyExpenditureResult {
	user_id: string;
	category_id: string;
	logged_amount: number;
	allowed_today: number;
	saved_today: number;
	over_budget: boolean;
	remaining_budget: number;
	suggested_daily_budget: number;
	pet_damaged: boolean;
	pet: {
		health: number;
		hearts: number;
		state: string | null;
		experience: number;
		level: number;
		inactivity: number;
	} | null;
	experience_gained: number;
	points_from_experience: number;
	points_awarded: number;
	level_up: {
		triggered: boolean;
		previous_level: number | null;
		current_level: number | null;
		reward_points: number;
		hearts_refilled: boolean;
		state_reset_to: string | null;
	} | null;
}

const petExpPerDollarSaved = Number(process.env.PET_EXP_PER_DOLLAR_SAVED || 0.2);
const userPointsPerPetExp = Number(process.env.USER_POINTS_PER_PET_EXP || 0.1);

const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10);

const daysBetween = (fromDateOnly: string, toDateOnlyValue: string): number => {
	const from = new Date(`${fromDateOnly}T00:00:00.000Z`);
	const to = new Date(`${toDateOnlyValue}T00:00:00.000Z`);
	const dayMs = 24 * 60 * 60 * 1000;
	return Math.max(0, Math.floor((to.getTime() - from.getTime()) / dayMs));
};

const roundMoney = (value: number): number => {
	return Math.round(value * 100) / 100;
};

export const applyBudgetConfiguration = async (
	input: ApplyBudgetConfigInput
): Promise<ApplyBudgetConfigResult> => {
	if (input.income <= 0) {
		throw new Error('Income must be greater than 0');
	}

	if (!Number.isInteger(input.payPeriod) || input.payPeriod <= 0) {
		throw new Error('payPeriod must be a positive integer');
	}

	if (!input.splits.length) {
		throw new Error('At least one split is required');
	}

	const totalPercentage = input.splits.reduce((sum, split) => sum + split.percentage, 0);
	if (totalPercentage > 100) {
		throw new Error('Total split percentage cannot exceed 100');
	}

	return withTransaction<ApplyBudgetConfigResult>(async (client) => {
		const userResult = await client.query<LockedUserRow>(
			`SELECT user_id, income, pay_period, last_active_day, points
			 FROM users
			 WHERE user_id = $1
			 FOR UPDATE`,
			[input.userId]
		);

		const user = userResult.rows[0];
		if (!user) {
			throw new Error('User not found');
		}

		const categoriesResult = await client.query<LockedCategoryRow>(
			`SELECT category_id, user_id, name, percentage, upper_limit, expenditure, daily_expenses
			 FROM category
			 WHERE user_id = $1
			 FOR UPDATE`,
			[input.userId]
		);

		if (categoriesResult.rows.length === 0) {
			throw new Error('No categories found for user');
		}

		const byCategoryId = new Map<string, LockedCategoryRow>();
		const byName = new Map<string, LockedCategoryRow>();

		for (const category of categoriesResult.rows) {
			byCategoryId.set(category.category_id, category);
			byName.set(category.name.trim().toLowerCase(), category);
		}

		for (const split of input.splits) {
			const category = split.category_id
				? byCategoryId.get(split.category_id)
				: split.name
					? byName.get(split.name.trim().toLowerCase())
					: undefined;

			if (!category) {
				throw new Error('Split category not found for this user');
			}

			if (split.percentage < 0 || split.percentage > 100) {
				throw new Error('Each split percentage must be between 0 and 100');
			}

			const upperLimit = roundMoney((input.income * split.percentage) / 100);
			const dailyBudget = roundMoney(upperLimit / input.payPeriod);

			await client.query(
				`UPDATE category
				 SET percentage = $2,
				     upper_limit = $3,
				     expenditure = 0,
				     daily_expenses = $4
				 WHERE category_id = $1`,
				[category.category_id, split.percentage, upperLimit, dailyBudget]
			);
		}

		const today = toDateOnly(new Date());
		await client.query(
			`UPDATE users
			 SET income = $2,
			     pay_period = $3,
			     last_active_day = $4
			 WHERE user_id = $1`,
			[input.userId, roundMoney(input.income), input.payPeriod, today]
		);

		const updatedCategoriesResult = await client.query<UpdatedBudgetCategory>(
			`SELECT category_id, name, percentage, upper_limit, expenditure, daily_expenses
			 FROM category
			 WHERE user_id = $1
			 ORDER BY name`,
			[input.userId]
		);

		return {
			user_id: input.userId,
			income: roundMoney(input.income),
			pay_period: input.payPeriod,
			categories: updatedCategoriesResult.rows,
		};
	});
};

export const logDailyExpenditure = async (
	input: LogDailyExpenditureInput
): Promise<LogDailyExpenditureResult> => {
	if (input.amount <= 0) {
		throw new Error('Amount must be greater than 0');
	}

	return withTransaction<LogDailyExpenditureResult>(async (client) => {
		const userResult = await client.query<LockedUserRow>(
			`SELECT user_id, income, pay_period, last_active_day, points
			 FROM users
			 WHERE user_id = $1
			 FOR UPDATE`,
			[input.userId]
		);
		const user = userResult.rows[0];

		if (!user) {
			throw new Error('User not found');
		}

		if (!user.pay_period || user.pay_period <= 0) {
			throw new Error('User pay_period is not configured');
		}

		const today = toDateOnly(new Date());
		const cycleStart = user.last_active_day ?? today;
		let elapsedDays = daysBetween(cycleStart, today);

		if (elapsedDays >= user.pay_period) {
			await client.query(
				`UPDATE category
				 SET expenditure = 0,
				     daily_expenses = CASE
				       WHEN upper_limit IS NULL THEN daily_expenses
				       ELSE ROUND((upper_limit / $2)::numeric, 2)
				     END
				 WHERE user_id = $1`,
				[input.userId, user.pay_period]
			);
			await client.query('UPDATE users SET last_active_day = $2 WHERE user_id = $1', [input.userId, today]);
			elapsedDays = 0;
		}

		const categoryResult = await client.query<LockedCategoryRow>(
			`SELECT category_id, user_id, name, percentage, upper_limit, expenditure, daily_expenses
			 FROM category
			 WHERE category_id = $1 AND user_id = $2
			 FOR UPDATE`,
			[input.categoryId, input.userId]
		);
		const category = categoryResult.rows[0];

		if (!category) {
			throw new Error('Category not found for user');
		}

		const upperLimit = Number(category.upper_limit ?? 0);
		const currentExpenditure = Number(category.expenditure ?? 0);
		if (!Number.isFinite(upperLimit) || upperLimit <= 0) {
			throw new Error('Category upper_limit is not configured');
		}

		const remainingDaysBefore = Math.max(1, user.pay_period - elapsedDays);
		const remainingBudgetBefore = Math.max(0, roundMoney(upperLimit - currentExpenditure));
		const allowedToday = roundMoney(remainingBudgetBefore / remainingDaysBefore);

		const newExpenditure = roundMoney(currentExpenditure + input.amount);
		const remainingBudgetAfter = Math.max(0, roundMoney(upperLimit - newExpenditure));
		const remainingDaysAfter = Math.max(1, remainingDaysBefore - 1);
		const suggestedDailyBudget = roundMoney(remainingBudgetAfter / remainingDaysAfter);

		await client.query(
			`UPDATE category
			 SET expenditure = $2,
			     daily_expenses = $3
			 WHERE category_id = $1`,
			[category.category_id, newExpenditure, suggestedDailyBudget]
		);

		const overBudget = input.amount > allowedToday;
		const savedToday = Math.max(0, roundMoney(allowedToday - input.amount));
		const experienceGained = Math.max(0, Math.floor(savedToday * petExpPerDollarSaved));
		const pointsFromExperience = Math.max(0, Math.floor(experienceGained * userPointsPerPetExp));
		let petDamaged = false;
		let petSnapshot: LogDailyExpenditureResult['pet'] = null;

		const petResult = await client.query<LockedPetRow>(
			`SELECT pet_id, health, hearts, state, experience, inactivity
			 FROM pet
			 WHERE user_id = $1
			 FOR UPDATE`,
			[input.userId]
		);

		const pet = petResult.rows[0];
		let levelUpRewardPoints = 0;
		let levelUpInfo: LogDailyExpenditureResult['level_up'] = null;
		if (pet) {
			const previousLevel = getPetLevel(pet.experience);
			let nextHealth = pet.health;
			let nextHearts = pet.hearts;
			let nextExperience = pet.experience + experienceGained;
			let nextInactivity = 0;

			if (overBudget) {
				petDamaged = true;
				nextHealth = pet.health - 10;
				if (nextHealth <= 0) {
					nextHearts = clampHearts(pet.hearts - 1);
					nextHealth = nextHearts > 0 ? 100 : 0;
				}
			}

			let nextState = getPetState(nextHealth, nextInactivity);
			const currentLevel = getPetLevel(nextExperience);

			if (currentLevel > previousLevel) {
				levelUpRewardPoints = (currentLevel - previousLevel) * PET_LEVEL_UP_POINTS_REWARD;
				nextHearts = PET_HEART_MAX;
				nextState = nextHealth <= 0 ? 'dead' : 'happy';
				levelUpInfo = {
					triggered: true,
					previous_level: previousLevel,
					current_level: currentLevel,
					reward_points: levelUpRewardPoints,
					hearts_refilled: true,
					state_reset_to: nextState,
				};
			}

			await client.query(
				`UPDATE pet
				 SET health = $2,
				     hearts = $3,
				     state = $4,
				     experience = $5,
				     inactivity = $6
				 WHERE pet_id = $1`,
				[pet.pet_id, nextHealth, nextHearts, nextState, nextExperience, nextInactivity]
			);

			petSnapshot = {
				health: nextHealth,
				hearts: nextHearts,
				state: nextState,
				experience: nextExperience,
				level: currentLevel,
				inactivity: nextInactivity,
			};
		}

		let pointsAwarded = 0;
		pointsAwarded += pointsFromExperience;
		pointsAwarded += levelUpRewardPoints;
		const isFinalDay = elapsedDays >= user.pay_period - 1;
		if (isFinalDay && newExpenditure <= upperLimit) {
			pointsAwarded += 10;
		}

		if (pointsAwarded > 0) {
			await client.query('UPDATE users SET points = points + $2 WHERE user_id = $1', [input.userId, pointsAwarded]);
		}

		return {
			user_id: input.userId,
			category_id: category.category_id,
			logged_amount: roundMoney(input.amount),
			allowed_today: allowedToday,
			saved_today: savedToday,
			over_budget: overBudget,
			remaining_budget: remainingBudgetAfter,
			suggested_daily_budget: suggestedDailyBudget,
			pet_damaged: petDamaged,
			pet: petSnapshot,
			experience_gained: experienceGained,
			points_from_experience: pointsFromExperience,
			points_awarded: pointsAwarded,
			level_up: levelUpInfo ?? {
				triggered: false,
				previous_level: pet ? getPetLevel(pet.experience) : null,
				current_level: petSnapshot?.level ?? (pet ? getPetLevel(pet.experience) : null),
				reward_points: 0,
				hearts_refilled: false,
				state_reset_to: null,
			},
		};
	});
};
