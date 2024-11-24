package com.topicos.ucu.repositories;

import com.topicos.ucu.entities.Transaction;
import com.topicos.ucu.entities.Category;
import com.topicos.ucu.entities.Transaction.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepositoryTransaction extends JpaRepository<Transaction, Long> {


    List<Transaction> findByCategory(Category category);


    List<Transaction> findByType(TransactionType type);
}
