package com.topicos.ucu.controllers;

import com.topicos.ucu.entities.User;
import com.topicos.ucu.services.JwtTokenProvider;
import com.topicos.ucu.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    private boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token.replace("Bearer ", ""));
    }

    @PostMapping(path = "/create")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        try {
            boolean isCreated = userService.save(user);
            if (isCreated) {
                log.info("Usuario creado exitosamente: {}", user.getUserName());
                return ResponseEntity.ok("Usuario creado exitosamente.");
            } else {
                log.warn("El usuario ya existe: {}", user.getUserName());
                return ResponseEntity.badRequest().body("El usuario ya existe.");
            }
        } catch (Exception e) {
            log.error("Error al crear el usuario: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error al crear el usuario.");
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<User> getUserById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        User user = userService.getById(id);
        if (user != null) {
            log.info("Usuario encontrado: {}", id);
            return ResponseEntity.ok(user);
        } else {
            log.warn("Usuario no encontrado: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping(path = "/getall")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String token) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        log.info("Listando todos los usuarios.");
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteUser(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body("Invalid token");
        }

        try {
            boolean isDeleted = userService.delete(id);
            if (isDeleted) {
                log.info("Usuario eliminado exitosamente: {}", id);
                return ResponseEntity.ok("Usuario eliminado exitosamente.");
            } else {
                log.warn("Usuario no encontrado: {}", id);
                return ResponseEntity.badRequest().body("Usuario no encontrado.");
            }
        } catch (Exception e) {
            log.error("Error al eliminar el usuario: {}", e.getMessage());
            return ResponseEntity.internalServerError().body("Error al eliminar el usuario.");
        }
    }
}
