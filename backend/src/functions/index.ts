export { checkHealth } from './health';

export {
	addUserPoints,
	createUser,
	deleteUser,
	getUserAuthByEmailOrUsername,
	getUserByEmail,
	getUserById,
	getUserByUsername,
	getUsers,
	updateUser,
} from './users';
export type { CreateUserInput, UpdateUserInput, UserAuthRecord, UserRecord } from './users';

export {
	createPetForUser,
	deletePetByUserId,
	getPetByUserId,
	updatePetByUserId,
} from './pet';
export type { CreatePetInput, PetRecord, UpdatePetInput } from './pet';

export {
	createCategory,
	deleteCategory,
	getCategoriesByUserId,
	getCategoryById,
	getCategoryTotalsByUserId,
	updateCategory,
} from './category';
export type {
	CategoryRecord,
	CategoryTotals,
	CreateCategoryInput,
	UpdateCategoryInput,
} from './category';

export {
	createShopForUser,
	createShopItem,
	deleteShopItem,
	getShopByUserId,
	getShopItemsByShopId,
	getShopItemsByUserId,
	purchaseShopItem,
	updateShopItem,
} from './shop';
export type {
	CreateShopItemInput,
	PurchaseResult,
	ShopItemRecord,
	ShopRecord,
	UpdateShopItemInput,
} from './shop';

export { getUserBudgetSummary, getUserProfileBundle } from './dashboard';
export type { UserBudgetSummary, UserProfileBundle } from './dashboard';
