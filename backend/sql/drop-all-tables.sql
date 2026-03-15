-- Active: 1773474530675@@two-cents-postgres.cbcse2moaurb.ap-southeast-2.rds.amazonaws.com@5432@postgres

-- Delete all tables (removes table structures entirely)
DROP TABLE IF EXISTS user_session, shop_item, shop, category, pet, users CASCADE;

-- Verify tables are removed
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
