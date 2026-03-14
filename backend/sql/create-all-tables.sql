CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    profile_picture TEXT,
    points INTEGER DEFAULT 0,
    income NUMERIC(10,2),
    pay_period INTEGER,
    last_active_day TEXT
);

CREATE TABLE pet (
    pet_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    health INTEGER DEFAULT 100,
    hearts INTEGER DEFAULT 3,
    state TEXT,
    experience INTEGER DEFAULT 0,
    inactivity INTEGER DEFAULT 0,
    equipped_items JSONB NOT NULL DEFAULT '[]'::jsonb,

    CONSTRAINT fk_pet_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE category (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    percentage NUMERIC(5,2),
    upper_limit NUMERIC(10,2),
    expenditure NUMERIC(10,2) DEFAULT 0,
    daily_expenses NUMERIC(10,2) DEFAULT 0,

    CONSTRAINT fk_category_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE shop (
    shop_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,

    CONSTRAINT fk_shop_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE shop_item (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL,
    name TEXT NOT NULL,
    price_points INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    cosmetic BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_item_shop
        FOREIGN KEY (shop_id)
        REFERENCES shop(shop_id)
        ON DELETE CASCADE
);
