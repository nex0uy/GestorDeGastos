package com.ucu.gestorgastos.repository;

import com.ucu.gestorgastos.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}
