-- Active: 1773474530675@@two-cents-postgres.cbcse2moaurb.ap-southeast-2.rds.amazonaws.com@5432@postgres

-- Optional reset so script is repeatable
TRUNCATE TABLE user_session, shop_item, shop, category, pet, users CASCADE;

-- 1) Users
INSERT INTO users (user_id, email, username, name, password, profile_picture, points, income, pay_period, last_active_day)
VALUES
	('c1a5f8d2-3b44-4d17-9c9b-2f6b0b2f5a11', 'alice@example.com', 'alicej', 'Alice Johnson', 'Password123!', 'https://i.pravatar.cc/150?img=1', 1200, 75000.00, 14, '2026-03-14'),
	('7e2d9a60-6c13-4f2a-8d4c-9b7f2c1a4e22', 'bob@example.com', 'bobsmith', 'Bob Smith', 'Password123!', 'https://i.pravatar.cc/150?img=2', 450, 52000.00, 30, '2026-03-13'),
	('0f4b71c3-9a6e-4c8d-a143-5e2a9d7b3f33', 'charlie@example.com', 'charlieb', 'Charlie Brown', 'Password123!', 'https://i.pravatar.cc/150?img=3', 90, 90000.00, 7, '2026-03-10'),
	('5d3a2e19-1f75-4b6c-b82d-4a9e6f1c8d44', 'diana@example.com', 'dianap', 'Diana Prince', 'Password123!', 'https://i.pravatar.cc/150?img=4', 880, 120000.00, 14, '2026-03-14'),
	('a9c4e730-2d8b-4f95-9e21-c7d4b6a1f555', 'evan@example.com', 'evanw', 'Evan Williams', 'Password123!', 'https://i.pravatar.cc/150?img=5', 300, 48000.00, 30, '2026-03-12');

-- 2) Pet (1 per user)
INSERT INTO pet (pet_id, user_id, name, health, hearts, state, experience, inactivity, equipped_items)
VALUES
	('14b2c7d9-8f31-4a6e-9a8b-1d2f3c4b5e61', 'c1a5f8d2-3b44-4d17-9c9b-2f6b0b2f5a11', 'Fluffy', 95, 3, 'happy', 220, 0, '["71a2c3d4-5e6f-4a17-9b28-c3d4e5f6a266"]'::jsonb),
	('2e9f4a13-b6c2-47d8-8b3f-7a5c1e9d0f72', '7e2d9a60-6c13-4f2a-8d4c-9b7f2c1a4e22', 'Naps', 80, 2, 'sleepy', 140, 1, '["93c4e5f6-7a8b-4c39-9d4a-e5f6a7b8c488"]'::jsonb),
	('3c7a0e5f-1d94-4b62-a9f7-6e3b2d1c8a83', '0f4b71c3-9a6e-4c8d-a143-5e2a9d7b3f33', 'Crunch', 70, 2, 'hungry', 90, 2, '["a4d5e6f7-8b9c-4d4a-8e5b-f6a7b8c9d599"]'::jsonb),
	('4d1b8f26-73ae-45c9-b0d2-8f6a3c1e9b94', '5d3a2e19-1f75-4b6c-b82d-4a9e6f1c8d44', 'Spark', 88, 3, 'excited', 180, 0, '["b5e6f7a8-9c0d-4e5b-9f6c-a7b8c9d0e6aa"]'::jsonb),
	('5f2c9a71-4e68-4d3b-9e15-2a7c6b8d0ea5', 'a9c4e730-2d8b-4f95-9e21-c7d4b6a1f555', 'Nimbus', 76, 2, 'calm', 110, 1, '["c6f7a8b9-0d1e-4f6c-8a7d-b8c9d0e1f7bb"]'::jsonb);

-- 3) Category (many per user)
INSERT INTO category (category_id, user_id, name, percentage, upper_limit, expenditure, daily_expenses)
VALUES
	('91a4d2c8-6b3e-4f17-8d9a-1e2f3c4b5d66', 'c1a5f8d2-3b44-4d17-9c9b-2f6b0b2f5a11', 'Food', 30.00, 1200.00, 430.25, 34.10),
	('a2c5e7f9-1d3b-47a6-b84c-2f9e0d1a6b77', 'c1a5f8d2-3b44-4d17-9c9b-2f6b0b2f5a11', 'Transport', 15.00, 600.00, 120.00, 8.57),
	('b3d6f819-2e4c-4b7a-9c15-3a0f2e4b7c88', '7e2d9a60-6c13-4f2a-8d4c-9b7f2c1a4e22', 'Rent', 40.00, 1800.00, 900.00, 30.00),
	('c4e7a92b-3f5d-4c8b-a26d-4b1a3f5c8d99', '7e2d9a60-6c13-4f2a-8d4c-9b7f2c1a4e22', 'Leisure', 10.00, 400.00, 95.20, 6.80),
	('d5f8b13c-4a6e-4d9c-b37e-5c2b4a6d9ea0', '0f4b71c3-9a6e-4c8d-a143-5e2a9d7b3f33', 'Savings', 20.00, 1000.00, 400.00, 28.57),
	('e6a9c24d-5b7f-4e1d-8c4f-6d3c5b7e1fb1', '5d3a2e19-1f75-4b6c-b82d-4a9e6f1c8d44', 'Health', 12.00, 500.00, 130.00, 9.28),
	('f7b1d35e-6c8a-4f2e-9d50-7e4d6c8f2ac2', 'a9c4e730-2d8b-4f95-9e21-c7d4b6a1f555', 'Entertainment', 8.00, 300.00, 82.50, 5.89);

-- 4) Shop (1 per user)
INSERT INTO shop (shop_id, user_id)
VALUES
	('2a4c6e8f-1b3d-4f57-9a61-c8d2e4f6a711', 'c1a5f8d2-3b44-4d17-9c9b-2f6b0b2f5a11'),
	('3b5d7f91-2c4e-4a68-8b72-d9e3f5a7b822', '7e2d9a60-6c13-4f2a-8d4c-9b7f2c1a4e22'),
	('4c6e8a12-3d5f-4b79-9c83-e1f4a6b8c933', '0f4b71c3-9a6e-4c8d-a143-5e2a9d7b3f33'),
	('5d7f9134-4e6a-4c8a-8d94-f2a5b7c9d044', '5d3a2e19-1f75-4b6c-b82d-4a9e6f1c8d44'),
	('6e8a1245-5f7b-4d9b-9ea5-a3b6c8d0e155', 'a9c4e730-2d8b-4f95-9e21-c7d4b6a1f555');

-- 5) Shop items (many per shop)
INSERT INTO shop_item (item_id, shop_id, name, price_points, quantity, cosmetic)
VALUES
	('71a2c3d4-5e6f-4a17-9b28-c3d4e5f6a266', '2a4c6e8f-1b3d-4f57-9a61-c8d2e4f6a711', 'Blue Collar', 150, 1, TRUE),
	('82b3d4e5-6f7a-4b28-8c39-d4e5f6a7b377', '2a4c6e8f-1b3d-4f57-9a61-c8d2e4f6a711', 'Health Potion', 200, 2, FALSE),
	('93c4e5f6-7a8b-4c39-9d4a-e5f6a7b8c488', '3b5d7f91-2c4e-4a68-8b72-d9e3f5a7b822', 'Golden Hat', 500, 1, TRUE),
	('a4d5e6f7-8b9c-4d4a-8e5b-f6a7b8c9d599', '4c6e8a12-3d5f-4b79-9c83-e1f4a6b8c933', 'XP Booster', 300, 1, FALSE),
	('b5e6f7a8-9c0d-4e5b-9f6c-a7b8c9d0e6aa', '5d7f9134-4e6a-4c8a-8d94-f2a5b7c9d044', 'Pet Snack', 90, 4, FALSE),
	('c6f7a8b9-0d1e-4f6c-8a7d-b8c9d0e1f7bb', '6e8a1245-5f7b-4d9b-9ea5-a3b6c8d0e155', 'Rainbow Skin', 650, 1, TRUE);

-- Quick verification
SELECT 'users' AS table_name, COUNT(*) AS rows FROM users
UNION ALL SELECT 'user_session', COUNT(*) FROM user_session
UNION ALL SELECT 'pet', COUNT(*) FROM pet
UNION ALL SELECT 'category', COUNT(*) FROM category
UNION ALL SELECT 'shop', COUNT(*) FROM shop
UNION ALL SELECT 'shop_item', COUNT(*) FROM shop_item
ORDER BY table_name;
