package com.topicos.ucu.services;

import com.topicos.ucu.entities.User;
import com.topicos.ucu.repositories.RepositoryUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final RepositoryUser repositoryUser;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public boolean save(User user) throws Exception {
        Optional<User> existUser = repositoryUser.getUserbyName(user.getUserName());
        if (existUser.isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            repositoryUser.save(user);
            return true;
        }
        return false;
    }

    public User getById(Long id) {
        Optional<User> existUser = repositoryUser.getUser(id);
        return existUser.orElse(null);
    }

    public User getUserByUserName(String userName) {
        Optional<User> existUser = repositoryUser.getUserbyName(userName);
        return existUser.orElse(null);
    }

    public List<User> findAll() {
        return repositoryUser.findAll();
    }

    public boolean delete(Long id) throws Exception {
        Optional<User> existUser = repositoryUser.getUser(id);
        if (existUser.isEmpty()) {
            return false;
        }
        repositoryUser.delete(existUser.get());
        return true;
    }

    public boolean checkPassword(String rawPassword, User user) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }
}
