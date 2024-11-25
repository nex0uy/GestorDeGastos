CREATE TABLE "users" ( --queda en plural para evitar problemas de palabra reservada en psql
    user_id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL
);

CREATE TABLE "category" (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE "bank_account" (
    bank_account_id SERIAL PRIMARY KEY,
    bank_name VARCHAR(100) NOT NULL,
    base_currency VARCHAR(10) NOT NULL,
    initial_balance NUMERIC(10, 2) NOT NULL,
    user_id INT REFERENCES "users" (user_id)
);

CREATE TABLE "transaction" (
    transaction_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('INCOME', 'EXPENSE')), -- ENUM equivalent in PostgreSQL
    is_recurrent BOOLEAN DEFAULT FALSE,
    user_id INT REFERENCES "users" (user_id),
    category_id INT REFERENCES "category" (category_id),
    bank_account_id INT REFERENCES "bank_account" (bank_account_id)
);

CREATE TABLE "budget" (
    budget_id SERIAL PRIMARY KEY,
    max_amount NUMERIC(10, 2) NOT NULL,
    alert_triggered BOOLEAN DEFAULT FALSE,
    initial_date DATE NOT NULL,
    category_id INT REFERENCES "category" (category_id),
    user_id INT REFERENCES "users" (user_id)
);

CREATE TABLE "currency" (
    currency_id SERIAL PRIMARY KEY,
    currency_name VARCHAR(50) NOT NULL
);

CREATE TABLE "exchange_rate" (
    exchange_rate_id SERIAL PRIMARY KEY,
    origin_currency INT NOT NULL REFERENCES "currency" (currency_id),
    destination_currency INT NOT NULL REFERENCES "currency" (currency_id),
    rate NUMERIC(10, 6) NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE "card" (
    card_id SERIAL PRIMARY KEY,
    card_type VARCHAR(10) CHECK (card_type IN ('debit', 'credit')), -- ENUM equivalent in PostgreSQL
    expiration_date DATE NOT NULL,
    limit_amount NUMERIC(10, 2), -- Optional limit for credit cards
    bank_account_id INT REFERENCES "bank_account" (bank_account_id)
);