package com.topicos.ucu.controllers;

import com.topicos.ucu.entities.Transaction;
import com.topicos.ucu.services.TransactionService;
import com.topicos.ucu.services.JwtTokenProvider;
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
    private final JwtTokenProvider jwtTokenUtil;

    @PostMapping(path = "/create")
    public ResponseEntity<Transaction> createTransaction(@RequestHeader("Authorization") String token, @RequestBody Transaction transaction) {
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body(null);
        }

        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        if (!transaction.getUserId().equals(tokenUserId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }

        Optional<Transaction> createdTransaction = transactionService.createTransaction(transaction);
        return createdTransaction.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(400).body(null));
    }

    @PutMapping(path = "/update/{id}/user/{userId}")
    public ResponseEntity<Transaction> updateTransaction(@RequestHeader("Authorization") String token, @PathVariable Long id, @PathVariable Long userId, @RequestBody Transaction transaction) {
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body(null);
        }

        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        if (!userId.equals(tokenUserId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }

        Optional<Transaction> updatedTransaction = transactionService.updateTransaction(id, transaction, tokenUserId);
        return updatedTransaction.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(400).body(null));
    }

    @GetMapping(path = "/get/{id}/user/{userId}")
    public ResponseEntity<Transaction> getTransactionById(@RequestHeader("Authorization") String token, @PathVariable Long userId, @PathVariable Long id) {
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body(null);
        }

        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        if (!userId.equals(tokenUserId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }

        Optional<Transaction> transactionOptional = transactionService.getById(id, userId);
        return transactionOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping(path = "/getall/user/{userId}")
    public ResponseEntity<List<Transaction>> getAllTransactions(@RequestHeader("Authorization") String token, @PathVariable Long userId) {
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body(null);
        }

        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        if (!userId.equals(tokenUserId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }

        List<Transaction> transactions = transactionService.getAllByUser(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping(path = "/getbycategory/{categoryId}/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByCategory(@RequestHeader("Authorization") String token, @PathVariable Long categoryId, @PathVariable Long userId) {
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body(null);
        }

        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        if (!userId.equals(tokenUserId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }

        List<Transaction> transactions = transactionService.getTransactionsByCategory(categoryId, userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping(path = "/getbytype/{type}/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByType(@RequestHeader("Authorization") String token, @PathVariable String type, @PathVariable Long userId) {
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body(null);
        }

        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        if (!userId.equals(tokenUserId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }

        Transaction.TransactionType transactionType = Transaction.TransactionType.valueOf(type.toUpperCase());
        List<Transaction> transactions = transactionService.getTransactionsByType(transactionType, userId);
        return ResponseEntity.ok(transactions);
    }

    @DeleteMapping(path = "/delete/{id}/user/{userId}")
    public ResponseEntity<String> deleteTransaction(@RequestHeader("Authorization") String token, @PathVariable Long id, @PathVariable Long userId) {
        if (!jwtTokenUtil.validateToken(token.replace("Bearer ", ""))) {
            return ResponseEntity.status(401).body(null);
        }

        Long tokenUserId = jwtTokenUtil.getUserIdFromToken(token.replace("Bearer ", ""));
        if (!userId.equals(tokenUserId)) {
            return ResponseEntity.status(403).body(null); // Forbidden
        }

        boolean deleted = transactionService.deleteTransaction(id, userId);
        if (deleted) {
            return ResponseEntity.ok("Transacción eliminada exitosamente.");
        }
        return ResponseEntity.badRequest().body("Transacción no encontrada.");
    }
}
