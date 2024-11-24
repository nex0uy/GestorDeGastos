package com.topicos.ucu.services;

import com.topicos.ucu.entities.Budget;
import com.topicos.ucu.entities.Category;
import com.topicos.ucu.entities.User;
import com.topicos.ucu.repositories.RepositoryBudget;
import com.topicos.ucu.repositories.RepositoryCategory;
import com.topicos.ucu.repositories.RepositoryUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final RepositoryBudget repositoryBudget;
    private final RepositoryUser repositoryUser;
    private final RepositoryCategory repositoryCategory;

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

    public List<Budget> getAll() {
        return repositoryBudget.findAll();
    }

    public boolean deleteBudget(Long id) {
        return repositoryBudget.findById(id).map(budget -> {
            repositoryBudget.delete(budget);
            return true;
        }).orElse(false);
    }
}
