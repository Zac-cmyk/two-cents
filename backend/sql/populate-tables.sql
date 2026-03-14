-- Active: 1773474530675@@two-cents-postgres.cbcse2moaurb.ap-southeast-2.rds.amazonaws.com@5432@postgres

-- Optional reset so script is repeatable
TRUNCATE TABLE shop_item, shop, category, pet, users CASCADE;

-- 1) Users
INSERT INTO users (user_id, email, name, points, income, pay_period, last_active_day)
VALUES
	('11111111-1111-1111-1111-111111111111', 'alice@example.com', 'Alice Johnson', 1200, 75000.00, 14, '2026-03-14'),
	('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'Bob Smith', 450, 52000.00, 30, '2026-03-13'),
	('33333333-3333-3333-3333-333333333333', 'charlie@example.com', 'Charlie Brown', 90, 90000.00, 7, '2026-03-10'),
	('44444444-4444-4444-4444-444444444444', 'diana@example.com', 'Diana Prince', 880, 120000.00, 14, '2026-03-14'),
	('55555555-5555-5555-5555-555555555555', 'evan@example.com', 'Evan Williams', 300, 48000.00, 30, '2026-03-12');

-- 2) Pet (1 per user)
INSERT INTO pet (pet_id, user_id, health, hearts, state, experience, inactivity)
VALUES
	('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 95, 3, 'happy', 220, 0),
	('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222', 80, 2, 'sleepy', 140, 1),
	('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '33333333-3333-3333-3333-333333333333', 70, 2, 'hungry', 90, 2),
	('aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '44444444-4444-4444-4444-444444444444', 88, 3, 'excited', 180, 0),
	('aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaa5', '55555555-5555-5555-5555-555555555555', 76, 2, 'calm', 110, 1);

-- 3) Category (many per user)
INSERT INTO category (category_id, user_id, name, percentage, upper_limit, expenditure, daily_expenses)
VALUES
	('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '11111111-1111-1111-1111-111111111111', 'Food', 30.00, 1200.00, 430.25, 34.10),
	('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '11111111-1111-1111-1111-111111111111', 'Transport', 15.00, 600.00, 120.00, 8.57),
	('bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbb3', '22222222-2222-2222-2222-222222222222', 'Rent', 40.00, 1800.00, 900.00, 30.00),
	('bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbb4', '22222222-2222-2222-2222-222222222222', 'Leisure', 10.00, 400.00, 95.20, 6.80),
	('bbbbbbb5-bbbb-bbbb-bbbb-bbbbbbbbbbb5', '33333333-3333-3333-3333-333333333333', 'Savings', 20.00, 1000.00, 400.00, 28.57),
	('bbbbbbb6-bbbb-bbbb-bbbb-bbbbbbbbbbb6', '44444444-4444-4444-4444-444444444444', 'Health', 12.00, 500.00, 130.00, 9.28),
	('bbbbbbb7-bbbb-bbbb-bbbb-bbbbbbbbbbb7', '55555555-5555-5555-5555-555555555555', 'Entertainment', 8.00, 300.00, 82.50, 5.89);

-- 4) Shop (1 per user)
INSERT INTO shop (shop_id, user_id)
VALUES
	('ccccccc1-cccc-cccc-cccc-ccccccccccc1', '11111111-1111-1111-1111-111111111111'),
	('ccccccc2-cccc-cccc-cccc-ccccccccccc2', '22222222-2222-2222-2222-222222222222'),
	('ccccccc3-cccc-cccc-cccc-ccccccccccc3', '33333333-3333-3333-3333-333333333333'),
	('ccccccc4-cccc-cccc-cccc-ccccccccccc4', '44444444-4444-4444-4444-444444444444'),
	('ccccccc5-cccc-cccc-cccc-ccccccccccc5', '55555555-5555-5555-5555-555555555555');

-- 5) Shop items (many per shop)
INSERT INTO shop_item (item_id, shop_id, name, price_points, quantity, cosmetic)
VALUES
	('ddddddd1-dddd-dddd-dddd-ddddddddddd1', 'ccccccc1-cccc-cccc-cccc-ccccccccccc1', 'Blue Collar', 150, 1, TRUE),
	('ddddddd2-dddd-dddd-dddd-ddddddddddd2', 'ccccccc1-cccc-cccc-cccc-ccccccccccc1', 'Health Potion', 200, 2, FALSE),
	('ddddddd3-dddd-dddd-dddd-ddddddddddd3', 'ccccccc2-cccc-cccc-cccc-ccccccccccc2', 'Golden Hat', 500, 1, TRUE),
	('ddddddd4-dddd-dddd-dddd-ddddddddddd4', 'ccccccc3-cccc-cccc-cccc-ccccccccccc3', 'XP Booster', 300, 1, FALSE),
	('ddddddd5-dddd-dddd-dddd-ddddddddddd5', 'ccccccc4-cccc-cccc-cccc-ccccccccccc4', 'Pet Snack', 90, 4, FALSE),
	('ddddddd6-dddd-dddd-dddd-ddddddddddd6', 'ccccccc5-cccc-cccc-cccc-ccccccccccc5', 'Rainbow Skin', 650, 1, TRUE);

-- Quick verification
SELECT 'users' AS table_name, COUNT(*) AS rows FROM users
UNION ALL SELECT 'pet', COUNT(*) FROM pet
UNION ALL SELECT 'category', COUNT(*) FROM category
UNION ALL SELECT 'shop', COUNT(*) FROM shop
UNION ALL SELECT 'shop_item', COUNT(*) FROM shop_item
ORDER BY table_name;
