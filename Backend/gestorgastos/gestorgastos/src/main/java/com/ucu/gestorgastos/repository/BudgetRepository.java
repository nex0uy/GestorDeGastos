package com.ucu.gestorgastos.repository;

import com.ucu.gestorgastos.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
}
