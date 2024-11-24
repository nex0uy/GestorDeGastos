package com.topicos.ucu.repositories;

import com.topicos.ucu.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RepositoryCategory extends JpaRepository<Category, Long> {
}
