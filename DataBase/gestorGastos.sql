CREATE TABLE "User" (
    user_id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    user_name VARCHAR(100) NOT NULL
);

CREATE TABLE "Category" (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE "Bank_Account" (
    bank_account_id SERIAL PRIMARY KEY,
    bank_name VARCHAR(100) NOT NULL,
    base_currency VARCHAR(10) NOT NULL,
    initial_balance NUMERIC(10, 2) NOT NULL,
    user_id INT REFERENCES "User" (user_id)
);

CREATE TABLE "Transaction" (
    transaction_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense')), -- ENUM equivalent in PostgreSQL
    is_recurrent BOOLEAN DEFAULT FALSE,
    user_id INT REFERENCES "User" (user_id),
    category_id INT REFERENCES "Category" (category_id),
    bank_account_id INT REFERENCES "Bank_Account" (bank_account_id)
);

CREATE TABLE "Budget" (
    budget_id SERIAL PRIMARY KEY,
    max_amount NUMERIC(10, 2) NOT NULL,
    alert_triggered BOOLEAN DEFAULT FALSE,
    category_id INT REFERENCES "Category" (category_id)
);

CREATE TABLE "Currency" (
    currency_id SERIAL PRIMARY KEY,
    currency_name VARCHAR(50) NOT NULL
);

CREATE TABLE "Exchange_Rate" (
    exchange_rate_id SERIAL PRIMARY KEY,
    origin_currency INT NOT NULL REFERENCES "Currency" (currency_id),
    destination_currency INT NOT NULL REFERENCES "Currency" (currency_id),
    rate NUMERIC(10, 6) NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE "Card" (
    card_id SERIAL PRIMARY KEY,
    card_type VARCHAR(10) CHECK (card_type IN ('debit', 'credit')), -- ENUM equivalent in PostgreSQL
    expiration_date DATE NOT NULL,
    limit_amount NUMERIC(10, 2), -- Optional limit for credit cards
    bank_account_id INT REFERENCES "Bank_Account" (bank_account_id)
);
