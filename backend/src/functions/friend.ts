import { execute, query, queryOne } from '../utils';
import { getUserById } from './users';

export interface FriendRecord {
	friend_id: string;
	user_id: string;
	friend_user_id: string;
	created_at: string;
}

export const getFriendsByUserId = async (userId: string): Promise<FriendRecord[]> => {
	return query<FriendRecord>(
		`SELECT friend_id, user_id, friend_user_id, created_at
		 FROM friend
		 WHERE user_id = $1
		 ORDER BY created_at DESC`,
		[userId]
	);
};

export const addFriend = async (userId: string, friendUserId: string): Promise<FriendRecord> => {
	if (userId === friendUserId) {
		throw new Error('Cannot add yourself as a friend');
	}

	// Ensure the friend exists
	const friendUser = await getUserById(friendUserId);
	if (!friendUser) {
		throw new Error('Friend user not found');
	}

	const row = await queryOne<FriendRecord>(
		`INSERT INTO friend (user_id, friend_user_id)
		 VALUES ($1, $2)
		 RETURNING friend_id, user_id, friend_user_id, created_at`,
		[userId, friendUserId]
	);

	if (!row) {
		throw new Error('Failed to add friend');
	}

	return row;
};

export const removeFriend = async (userId: string, friendUserId: string): Promise<boolean> => {
	const affectedRows = await execute(
		`DELETE FROM friend WHERE user_id = $1 AND friend_user_id = $2`,
		[userId, friendUserId]
	);
	return affectedRows > 0;
};
