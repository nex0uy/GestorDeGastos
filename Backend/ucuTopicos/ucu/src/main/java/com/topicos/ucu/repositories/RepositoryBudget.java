package com.topicos.ucu.repositories;

import com.topicos.ucu.entities.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepositoryBudget extends JpaRepository<Budget, Long> {
    Optional<Budget> findByCategory_CategoryIdAndUser_UserId(Long categoryId, Long userId);

}