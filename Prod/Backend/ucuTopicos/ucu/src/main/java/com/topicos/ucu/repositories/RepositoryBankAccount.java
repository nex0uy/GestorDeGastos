package com.topicos.ucu.repositories;

import com.topicos.ucu.entities.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepositoryBankAccount extends JpaRepository<BankAccount, Long> {
    List<BankAccount> findByUser_UserId(Long userId);
    BankAccount findByUser_UserIdAndBankAccountId(Long userId, Long bankAccountId);
}
