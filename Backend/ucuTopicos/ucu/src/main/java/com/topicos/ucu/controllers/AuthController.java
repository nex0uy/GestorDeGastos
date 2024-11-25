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
    public ResponseEntity<?> login(@RequestParam String userName, @RequestParam String password) {
        try {
            User user = userService.getUserByUserName(userName);
            if (user != null && userService.checkPassword(password, user)) {
                String token = jwtTokenProvider.generateToken(user.getUserId(), userName);

                // Crear un objeto JSON con el token y el user_id
                return ResponseEntity.ok(new LoginResponse(user.getUserId(), token, user.getUserName()));
            } else {
                return ResponseEntity.status(401).body("Invalid username or password");
            }
        } catch (Exception ex) {
            log.error("Login error: {}", ex.getMessage());
            return ResponseEntity.status(500).body("An error occurred during login");
        }
    }

    // Clase para la respuesta del login
    private static class LoginResponse {
        private Long userId;
        private String token;
        private String userName;

        public LoginResponse(Long userId, String token, String userName) {
            this.userId = userId;
            this.token = token;
            this.userName = userName;
        }

        public Long getUserId() {
            return userId;
        }

        public String getToken() {
            return token;
        }
        public String getUserName() {
            return userName;
        }

    }
}
