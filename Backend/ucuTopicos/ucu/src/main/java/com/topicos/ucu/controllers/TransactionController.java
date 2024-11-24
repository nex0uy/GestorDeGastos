package com.topicos.ucu.controllers;

import com.topicos.ucu.entities.Transaction;
import com.topicos.ucu.services.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/transaction")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping(path = "/create")
    public ResponseEntity<Transaction> createTransaction(@RequestHeader("Authorization") String token, @RequestBody Transaction transaction) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        Optional<Transaction> createdTransaction = transactionService.createTransaction(transaction);
        return createdTransaction.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(400).body(null));
    }

    @PutMapping(path = "/update/{id}")
    public ResponseEntity<Transaction> updateTransaction(@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestBody Transaction transaction) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        Optional<Transaction> updatedTransaction = transactionService.updateTransaction(id, transaction);
        return updatedTransaction.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(400).body(null));
    }

    @GetMapping(path = "/get/{id}")
    public ResponseEntity<Transaction> getTransactionById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        Optional<Transaction> transactionOptional = transactionService.getById(id);
        return transactionOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping(path = "/getall")
    public ResponseEntity<List<Transaction>> getAllTransactions(@RequestHeader("Authorization") String token) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        List<Transaction> transactions = transactionService.getAll();
        return ResponseEntity.ok(transactions);
    }

    // Método para obtener transacciones por categoría
    @GetMapping(path = "/getbycategory/{categoryId}")
    public ResponseEntity<List<Transaction>> getTransactionsByCategory(@RequestHeader("Authorization") String token, @PathVariable Long categoryId) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        List<Transaction> transactions = transactionService.getTransactionsByCategory(categoryId);
        return ResponseEntity.ok(transactions);
    }

    // Método para obtener transacciones por tipo (INCOME o EXPENSE)
    @GetMapping(path = "/getbytype/{type}")
    public ResponseEntity<List<Transaction>> getTransactionsByType(@RequestHeader("Authorization") String token, @PathVariable String type) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        Transaction.TransactionType transactionType = Transaction.TransactionType.valueOf(type.toUpperCase());
        List<Transaction> transactions = transactionService.getTransactionsByType(transactionType);
        return ResponseEntity.ok(transactions);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteTransaction(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }

        boolean deleted = transactionService.deleteTransaction(id);
        if (deleted) {
            return ResponseEntity.ok("Transacción eliminada exitosamente.");
        }
        return ResponseEntity.badRequest().body("Transacción no encontrada.");
    }

    // Lógica de validación de token (simulada, debes implementarla en tu servicio de autenticación)
    private boolean validateToken(String token) {
        // Aquí puedes agregar tu lógica para validar el token JWT
        return token != null && token.startsWith("Bearer ");
    }
}
