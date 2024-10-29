package com.ucu.gestorgastos.repository;

import com.ucu.gestorgastos.model.Spent;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SpentRepository extends JpaRepository<Spent, Long> {
}
