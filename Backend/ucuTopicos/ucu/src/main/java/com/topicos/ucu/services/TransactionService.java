package com.topicos.ucu.services;

import com.topicos.ucu.entities.BankAccount;
import com.topicos.ucu.entities.Category;
import com.topicos.ucu.entities.Transaction;
import com.topicos.ucu.entities.User;
import com.topicos.ucu.repositories.RepositoryBankAccount;
import com.topicos.ucu.repositories.RepositoryCategory;
import com.topicos.ucu.repositories.RepositoryTransaction;
import com.topicos.ucu.repositories.RepositoryUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final RepositoryTransaction repositoryTransaction;
    private final RepositoryUser repositoryUser;
    private final RepositoryCategory repositoryCategory;
    private final RepositoryBankAccount repositoryBankAccount;

    public Optional<Transaction> createTransaction(Transaction transaction) {
        Long userId = transaction.getUserId();
        Long categoryId = transaction.getCategoryId();
        Long bankAccountId = transaction.getBankAccountId();

        User user = repositoryUser.findById(userId).orElse(null);
        Category category = repositoryCategory.findById(categoryId).orElse(null);
        BankAccount bankAccount = repositoryBankAccount.findById(bankAccountId).orElse(null);

        if (user != null && category != null && bankAccount != null) {
            transaction.setUser(user);
            transaction.setCategory(category);
            transaction.setBankAccount(bankAccount);

            updateBankAccountBalance(bankAccount, transaction.getAmount(), transaction.getType());

            Transaction savedTransaction = repositoryTransaction.save(transaction);
            return Optional.of(savedTransaction);
        } else {
            return Optional.empty();
        }
    }

    public Optional<Transaction> updateTransaction(Long id, Transaction transaction) {
        Transaction existingTransaction = repositoryTransaction.findById(id).orElse(null);
        if (existingTransaction == null) {
            return Optional.empty();
        }

        Long userId = transaction.getUserId();
        Long categoryId = transaction.getCategoryId();
        Long bankAccountId = transaction.getBankAccountId();

        User user = repositoryUser.findById(userId).orElse(null);
        Category category = repositoryCategory.findById(categoryId).orElse(null);
        BankAccount bankAccount = repositoryBankAccount.findById(bankAccountId).orElse(null);

        if (user != null && category != null && bankAccount != null) {
            BigDecimal originalAmount = existingTransaction.getAmount();
            BigDecimal newAmount = transaction.getAmount();

            existingTransaction.setDate(transaction.getDate());
            existingTransaction.setDescription(transaction.getDescription());
            existingTransaction.setAmount(newAmount);
            existingTransaction.setType(transaction.getType());
            existingTransaction.setIsRecurrent(transaction.getIsRecurrent());
            existingTransaction.setUser(user);
            existingTransaction.setCategory(category);
            existingTransaction.setBankAccount(bankAccount);

            // Actualiza el balance dependiendo de si la transacción es de ingreso o gasto
            updateBankAccountBalance(bankAccount, newAmount.subtract(originalAmount), transaction.getType());

            Transaction updatedTransaction = repositoryTransaction.save(existingTransaction);
            return Optional.of(updatedTransaction);
        } else {
            return Optional.empty();
        }
    }

    public Optional<Transaction> getById(Long id) {
        return repositoryTransaction.findById(id);
    }

    public List<Transaction> getAll() {
        return repositoryTransaction.findAll();
    }

    public boolean deleteTransaction(Long id) {
        if (repositoryTransaction.existsById(id)) {
            Transaction transaction = repositoryTransaction.findById(id).get();
            BankAccount bankAccount = transaction.getBankAccount();
            updateBankAccountBalance(bankAccount, transaction.getAmount().negate(), transaction.getType());

            repositoryTransaction.deleteById(id);
            return true;
        }
        return false;
    }

    private void updateBankAccountBalance(BankAccount bankAccount, BigDecimal amount, Transaction.TransactionType transactionType) {
        // Verificamos el tipo de transacción y ajustamos el balance
        if (transactionType == Transaction.TransactionType.EXPENSE) {
            bankAccount.setInitialBalance(bankAccount.getInitialBalance().subtract(amount));
        } else if (transactionType == Transaction.TransactionType.INCOME) {
            bankAccount.setInitialBalance(bankAccount.getInitialBalance().add(amount));
        }
        repositoryBankAccount.save(bankAccount);
    }

    // Filtrar transacciones por categoría (tipo de gasto)
    public List<Transaction> getTransactionsByCategory(Long categoryId) {
        Category category = repositoryCategory.findById(categoryId).orElse(null);
        if (category != null) {
            return repositoryTransaction.findByCategory(category);
        }
        return List.of(); // Devuelve una lista vacía si no se encuentra la categoría
    }

    // Filtrar transacciones por tipo (INCOME o EXPENSE)
    public List<Transaction> getTransactionsByType(Transaction.TransactionType type) {
        return repositoryTransaction.findByType(type);
    }
}
