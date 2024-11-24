package com.topicos.ucu.controllers;

import com.topicos.ucu.entities.User;
import com.topicos.ucu.services.JwtTokenProvider;
import com.topicos.ucu.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Endpoint para login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String userName, @RequestParam String password) {
        try {
            User user = userService.getUserByUserName(userName);
            if (user != null && userService.checkPassword(password, user)) {
                String token = jwtTokenProvider.generateToken(user.getUserId(), userName);
                return ResponseEntity.ok(token);
            } else {
                return ResponseEntity.status(401).body("Invalid username or password");
            }
        } catch (Exception ex) {
            log.error("Login error: {}", ex.getMessage());
            return ResponseEntity.status(500).body("An error occurred during login");
        }
    }
}
