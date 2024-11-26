package com.topicos.ucu.controllers;

import com.topicos.ucu.entities.Budget;
import com.topicos.ucu.services.BudgetService;
import com.topicos.ucu.services.JwtTokenProvider;
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
    private final JwtTokenProvider jwtTokenUtil;

    @GetMapping(path = "/check-budget-status/category/{categoryId}/user/{userId}")
    public ResponseEntity<String> checkBudgetStatus(@RequestHeader("Authorization") String token, @PathVariable Long categoryId, @PathVariable Long userId) {
        // Validamos el token
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body("Invalid token");
        }

        // Extraemos el userId del token
        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        if (!userId.equals(tokenUserId)) {
            return ResponseEntity.status(403).body("Forbidden"); // El usuario no tiene acceso a este presupuesto
        }

        // Buscamos el presupuesto para esa categoría y usuario
        Optional<Budget> budgetOptional = budgetService.getBudgetByCategoryIdAndUserId(categoryId, userId);
        if (!budgetOptional.isPresent()) {
            return ResponseEntity.status(404).body("No budget found for this category and user");
        }

        // Verificamos si el presupuesto ha sido superado
        Budget budget = budgetOptional.get();
        boolean exceeded = budgetService.isBudgetExceeded(budget.getBudgetId(), userId);

        if (exceeded) {
            return ResponseEntity.ok("Alert: You have exceeded 80% of your budget for this category!");
        } else {
            return ResponseEntity.ok("You are within your budget.");
        }
    }

    @PostMapping(path = "/create")
    public ResponseEntity<Budget> createBudget(@RequestHeader("Authorization") String token, @RequestBody Budget budget) {
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body(null);
        }

        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        if (!budget.getUserId().equals(tokenUserId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }
        Optional<Budget> createdBudget = budgetService.createBudget(budget);
        return createdBudget.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(400).body(null));
    }

    @PutMapping(path = "/update/{id}")
    public ResponseEntity<Budget> updateBudget(@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestBody Budget budget) {
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body(null);
        }

        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        if (!budget.getUserId().equals(tokenUserId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }

        Optional<Budget> updatedBudget = budgetService.updateBudget(id, budget);
        return updatedBudget.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(400).body(null));
    }

    @GetMapping(path = "/get/{id}/user/{userId}")
    public ResponseEntity<Budget> getBudgetById(@RequestHeader("Authorization") String token, @PathVariable Long userId, @PathVariable Long id) {
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body(null);  // Unauthorized
        }

        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));

        if (!userId.equals(tokenUserId)) {
            return ResponseEntity.status(403).body(null);  // Forbidden
        }

        Optional<Budget> budgetOptional = budgetService.getByIdAndUser(id, userId);
        return budgetOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());  // Return 404 if not found
    }

    @GetMapping(path = "/getall")
    public ResponseEntity<List<Budget>> getAllBudgets(@RequestHeader("Authorization") String token) {
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body(null);  // Unauthorized
        }

        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));

        List<Budget> budgets = budgetService.getAllByUser(tokenUserId);
        return ResponseEntity.ok(budgets);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteBudget(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body(null);
        }

        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        if (!id.equals(tokenUserId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }
        boolean deleted = budgetService.deleteBudget(id);
        if (deleted) {
            return ResponseEntity.ok("Presupuesto eliminado exitosamente.");
        }
        return ResponseEntity.badRequest().body("Presupuesto no encontrado.");
    }

}
