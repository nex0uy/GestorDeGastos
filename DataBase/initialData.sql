-- Insertar usuarios
INSERT INTO "users" (password, user_name) VALUES 
('password123', 'JohnDoe'),
('securePass456', 'JaneSmith'),
('myPass789', 'AliceBrown');

-- Insertar categorías
INSERT INTO "category" (category_name) VALUES 
('Groceries'),
('Entertainment'),
('Utilities'),
('Travel'),
('Savings');

-- Insertar monedas
INSERT INTO "currency" (currency_name) VALUES
('USD'),
('EUR'),
('UYP');

-- Insertar cuentas bancarias
INSERT INTO "bank_account" (bank_name, base_currency, initial_balance, user_id) VALUES
('Bank of America', 1, 5000.00, 1),
('Chase Bank', 1, 3000.00, 2),
('Wells Fargo', 1, 7000.00, 3);

-- Insertar transacciones
INSERT INTO "transaction" (date, description, amount, type, is_recurrent, user_id, category_id, bank_account_id) VALUES
('2024-11-01', 'Grocery shopping', -150.50, 'expense', FALSE, 1, 1, 1),
('2024-11-02', 'Concert tickets', -75.00, 'expense', FALSE, 2, 2, 2),
('2024-11-03', 'Electricity bill', -120.00, 'expense', FALSE, 3, 3, 3),
('2024-11-05', 'Salary', 3000.00, 'income', TRUE, 1, NULL, 1),
('2024-11-06', 'Freelance job', 500.00, 'income', FALSE, 2, NULL, 2);

-- Insertar presupuestos
INSERT INTO "budget" (max_amount, alert_triggered, category_id) VALUES
(500.00, FALSE, 1),
(300.00, TRUE, 2),
(100.00, FALSE, 3);

-- Insertar tasas de cambio
INSERT INTO "exchange_rate" (origin_currency, destination_currency, rate, date) VALUES
(1, 2, 0.85, '2024-11-01'),
(1, 3, 0.75, '2024-11-01'),
(2, 3, 0.88, '2024-11-01');

-- Insertar tarjetas
INSERT INTO "card" (card_type, expiration_date, limit_amount, bank_account_id) VALUES
('credit', '2025-11-30', 2000.00, 1),
('debit', '2026-04-15', NULL, 2),
('credit', '2024-12-31', 1500.00, 3);