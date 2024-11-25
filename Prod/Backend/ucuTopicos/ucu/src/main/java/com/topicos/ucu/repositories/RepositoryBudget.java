package com.topicos.ucu.repositories;

import com.topicos.ucu.entities.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositoryBudget extends JpaRepository<Budget, Long> {
}