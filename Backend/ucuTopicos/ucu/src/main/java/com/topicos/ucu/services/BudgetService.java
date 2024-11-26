package com.topicos.ucu.services;

import com.topicos.ucu.entities.Budget;
import com.topicos.ucu.entities.Category;
import com.topicos.ucu.entities.Transaction;
import com.topicos.ucu.entities.User;
import com.topicos.ucu.repositories.RepositoryBudget;
import com.topicos.ucu.repositories.RepositoryCategory;
import com.topicos.ucu.repositories.RepositoryUser;
import com.topicos.ucu.repositories.RepositoryTransaction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class BudgetService {

    private final RepositoryBudget repositoryBudget;
    private final RepositoryUser repositoryUser;
    private final RepositoryCategory repositoryCategory;
    private final RepositoryTransaction repositoryTransaction;


    // Método para verificar si el presupuesto ha sido superado más del 80%
    public boolean isBudgetExceeded(Long budgetId, Long userId) {
        // Obtener el presupuesto por su ID
        Optional<Budget> budgetOptional = repositoryBudget.findById(budgetId);
        if (!budgetOptional.isPresent()) {
            return false; // Presupuesto no encontrado
        }

        Budget budget = budgetOptional.get();
        Long categoryId = budget.getCategory().getCategoryId();

        // Obtener todas las transacciones del usuario con el categoryId correspondiente
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        BigDecimal totalSpent = getTotalSpentForCategory(userId, categoryId, oneMonthAgo);

        // Comprobar si se ha superado el 80% del presupuesto
        BigDecimal budgetAmount = budget.getMaxAmount();
        BigDecimal threshold = budgetAmount.multiply(BigDecimal.valueOf(0.8));
        return totalSpent.compareTo(threshold) >= 0;
    }

    // Método para obtener el total gastado en una categoría en el último mes
    private BigDecimal getTotalSpentForCategory(Long userId, Long categoryId, LocalDate startDate) {
        // Obtener transacciones por usuario y categoría con fecha dentro del último mes
        List<Transaction> transactions = repositoryTransaction.findByUser_UserIdAndCategory_CategoryIdAndDateAfter(userId, categoryId, startDate);

        BigDecimal totalSpent = BigDecimal.ZERO;

        for (Transaction transaction : transactions) {
            // Solo sumamos las transacciones de tipo EXPENSE
            if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
                totalSpent = totalSpent.add(transaction.getAmount());
            }
        }

        return totalSpent;
    }


    public Optional<Budget> createBudget(Budget budget) {
        Long userId = budget.getUser().getUserId();
        Long categoryId = budget.getCategory().getCategoryId();

        User user = repositoryUser.findById(userId).orElse(null);
        Category category = repositoryCategory.findById(categoryId).orElse(null);

        if (user != null && category != null) {
            budget.setUser(user);
            budget.setCategory(category);
            Budget savedBudget = repositoryBudget.save(budget);
            return Optional.of(savedBudget);
        } else {
            return Optional.empty();
        }
    }

    public Optional<Budget> updateBudget(Long id, Budget budget) {
        return repositoryBudget.findById(id).flatMap(existingBudget -> {
            Long userId = budget.getUser().getUserId();
            Long categoryId = budget.getCategory().getCategoryId();

            User user = repositoryUser.findById(userId).orElse(null);
            Category category = repositoryCategory.findById(categoryId).orElse(null);

            if (user != null && category != null) {
                existingBudget.setMaxAmount(budget.getMaxAmount());
                existingBudget.setAlertTriggered(budget.getAlertTriggered());
                existingBudget.setInitialDate(budget.getInitialDate());
                existingBudget.setUser(user);
                existingBudget.setCategory(category);

                Budget updatedBudget = repositoryBudget.save(existingBudget);
                return Optional.of(updatedBudget);
            } else {
                return Optional.empty();
            }
        });
    }

    public Optional<Budget> getById(Long id) {
        return repositoryBudget.findById(id);
    }
    public Optional<Budget> getBudgetByCategoryIdAndUserId(Long categoryId, Long userId) {
        return repositoryBudget.findByCategory_CategoryIdAndUser_UserId(categoryId, userId);
    }

    public List<Budget> getAll() {
        return repositoryBudget.findAll();
    }

    public boolean deleteBudget(Long id) {
        return repositoryBudget.findById(id).map(budget -> {
            repositoryBudget.delete(budget);
            return true;
        }).orElse(false);
    }
    public Optional<Budget> getByIdAndUser(Long id, Long userId) {
        return repositoryBudget.findById(id)
                .filter(budget -> budget.getUser().getUserId().equals(userId));  // Filtra por usuario
    }

    public List<Budget> getAllByUser(Long userId) {
        return repositoryBudget.findAll()
                .stream()
                .filter(budget -> budget.getUser().getUserId().equals(userId))  // Filtra por usuario
                .collect(Collectors.toList());
    }
}
