package com.ucu.gestorgastos.repository;

import com.ucu.gestorgastos.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Aquí puedes agregar métodos personalizados de consulta si lo necesitas
    User findByEmail(String email);
}
