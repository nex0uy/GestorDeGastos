package com.topicos.ucu.repositories;

import com.topicos.ucu.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RepositoryUser extends JpaRepository<User, Long> {

    //@formatter:off
    @Query("SELECT u FROM User u where u.userId = :id")
    //@formatter:on
    Optional<User> getUser(@Param("id") Long id);

    //@formatter:off
    @Query("SELECT u FROM User u where UPPER(u.userName) = UPPER(:name)")
    //@formatter:on
    Optional<User> getUserbyName(@Param("name") String name);

}
