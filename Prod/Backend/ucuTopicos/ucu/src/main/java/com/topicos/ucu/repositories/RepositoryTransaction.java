package com.topicos.ucu.repositories;

import com.topicos.ucu.entities.Category;
import com.topicos.ucu.entities.Transaction;
import com.topicos.ucu.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepositoryTransaction extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);

    List<Transaction> findByCategoryAndUser(Category category, User user);

    List<Transaction> findByTypeAndUser(Transaction.TransactionType type, User user);
}
