package com.topicos.ucu.controllers;

import com.topicos.ucu.entities.Budget;
import com.topicos.ucu.services.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/budget")
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping(path = "/create")
    public ResponseEntity<Budget> createBudget(@RequestHeader("Authorization") String token, @RequestBody Budget budget) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        Optional<Budget> createdBudget = budgetService.createBudget(budget);
        return createdBudget.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(400).body(null));
    }

    @PutMapping(path = "/update/{id}")
    public ResponseEntity<Budget> updateBudget(@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestBody Budget budget) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        Optional<Budget> updatedBudget = budgetService.updateBudget(id, budget);
        return updatedBudget.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(400).body(null));
    }

    @GetMapping(path = "/get/{id}")
    public ResponseEntity<Budget> getBudgetById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        Optional<Budget> budgetOptional = budgetService.getById(id);
        return budgetOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping(path = "/getall")
    public ResponseEntity<List<Budget>> getAllBudgets(@RequestHeader("Authorization") String token) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        List<Budget> budgets = budgetService.getAll();
        return ResponseEntity.ok(budgets);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteBudget(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        boolean deleted = budgetService.deleteBudget(id);
        if (deleted) {
            return ResponseEntity.ok("Presupuesto eliminado exitosamente.");
        }
        return ResponseEntity.badRequest().body("Presupuesto no encontrado.");
    }

    // Lógica de validación de token (simulada, debes implementarla en tu servicio de autenticación)
    private boolean validateToken(String token) {
        // Aquí puedes agregar tu lógica para validar el token JWT
        return token != null && token.startsWith("Bearer ");
    }
}
