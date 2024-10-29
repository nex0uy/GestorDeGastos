package com.ucu.gestorgastos.repository;

import com.ucu.gestorgastos.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
