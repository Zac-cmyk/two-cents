-- Active: 1773474530675@@two-cents-postgres.cbcse2moaurb.ap-southeast-2.rds.amazonaws.com@5432@postgres
-- Clear all table data while preserving table structures
TRUNCATE TABLE user_session, shop_item, shop, category, pet, users CASCADE;

-- Verify row counts after clear
SELECT 'users' AS table_name, COUNT(*) AS rows FROM users
UNION ALL SELECT 'user_session', COUNT(*) FROM user_session
UNION ALL SELECT 'pet', COUNT(*) FROM pet
UNION ALL SELECT 'category', COUNT(*) FROM category
UNION ALL SELECT 'shop', COUNT(*) FROM shop
UNION ALL SELECT 'shop_item', COUNT(*) FROM shop_item
ORDER BY table_name;
