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

    public Optional<Transaction> updateTransaction(Long id, Transaction transaction, Long userId) {
        Transaction existingTransaction = repositoryTransaction.findById(id).orElse(null);
        if (existingTransaction == null || !existingTransaction.getUser().getUserId().equals(userId)) {
            return Optional.empty();
        }

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

            updateBankAccountBalance(bankAccount, newAmount.subtract(originalAmount), transaction.getType());

            Transaction updatedTransaction = repositoryTransaction.save(existingTransaction);
            return Optional.of(updatedTransaction);
        } else {
            return Optional.empty();
        }
    }

    public Optional<Transaction> getById(Long id, Long userId) {
        Optional<Transaction> transaction = repositoryTransaction.findById(id);
        return transaction.filter(t -> t.getUser().getUserId().equals(userId));
    }

    public List<Transaction> getAllByUser(Long userId) {
        User user = repositoryUser.findById(userId).orElse(null);
        if (user != null) {
            return repositoryTransaction.findByUser(user);
        }
        return List.of();
    }

    public boolean deleteTransaction(Long id, Long userId) {
        Optional<Transaction> transactionOptional = repositoryTransaction.findById(id);
        if (transactionOptional.isPresent()) {
            Transaction transaction = transactionOptional.get();
            if (transaction.getUser().getUserId().equals(userId)) {
                BankAccount bankAccount = transaction.getBankAccount();
                updateBankAccountBalance(bankAccount, transaction.getAmount().negate(), transaction.getType());
                repositoryTransaction.deleteById(id);
                return true;
            }
        }
        return false;
    }

    private void updateBankAccountBalance(BankAccount bankAccount, BigDecimal amount, Transaction.TransactionType transactionType) {
        if (transactionType == Transaction.TransactionType.EXPENSE) {
            bankAccount.setInitialBalance(bankAccount.getInitialBalance().subtract(amount));
        } else if (transactionType == Transaction.TransactionType.INCOME) {
            bankAccount.setInitialBalance(bankAccount.getInitialBalance().add(amount));
        }
        repositoryBankAccount.save(bankAccount);
    }

    public List<Transaction> getTransactionsByCategory(Long categoryId, Long userId) {
        Category category = repositoryCategory.findById(categoryId).orElse(null);
        User user = repositoryUser.findById(userId).orElse(null);
        if (category != null && user != null) {
            return repositoryTransaction.findByCategoryAndUser(category, user);
        }
        return List.of();
    }

    public List<Transaction> getTransactionsByType(Transaction.TransactionType type, Long userId) {
        User user = repositoryUser.findById(userId).orElse(null);
        if (user != null) {
            return repositoryTransaction.findByTypeAndUser(type, user);
        }
        return List.of();
    }
}
