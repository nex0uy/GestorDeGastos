package com.topicos.ucu.controllers;

import com.topicos.ucu.entities.BankAccount;
import com.topicos.ucu.services.BankAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.topicos.ucu.services.JwtTokenProvider;

import java.util.List;
@RestController
@RequiredArgsConstructor
@RequestMapping("/bank-accounts")
public class BankAccountController {

    private final BankAccountService bankAccountService;

    private final JwtTokenProvider jwtTokenUtil;

    @PostMapping(path = "/create")
    public ResponseEntity<BankAccount> createBankAccount(@RequestHeader("Authorization") String token, @RequestBody BankAccount bankAccount) {
        if (!jwtTokenUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }
        BankAccount savedBankAccount = bankAccountService.create(bankAccount);
        return ResponseEntity.ok(savedBankAccount);
    }

    @GetMapping(path = "/get/{id}")
    public ResponseEntity<BankAccount> getBankAccountById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!jwtTokenUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }
        BankAccount bankAccount = bankAccountService.getById(id);
        if (bankAccount != null) {
            return ResponseEntity.ok(bankAccount);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping(path = "/getall")
    public ResponseEntity<List<BankAccount>> getAllBankAccounts(@RequestHeader("Authorization") String token) {
        if (!jwtTokenUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }
        List<BankAccount> bankAccounts = bankAccountService.getAll();
        return ResponseEntity.ok(bankAccounts);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBankAccount(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!jwtTokenUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }
        boolean deleted = bankAccountService.delete(id);
        if (deleted) {
            return ResponseEntity.ok("Bank account eliminada exitosamente.");
        }
        return ResponseEntity.badRequest().body("Bank account no encontrada.");
    }

    @PutMapping(path = "/update/{id}")
    public ResponseEntity<BankAccount> updateBankAccount(@RequestHeader("Authorization") String token, @PathVariable Long id, @RequestBody BankAccount bankAccount) {
        if (!jwtTokenUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }
        BankAccount updatedBankAccount = bankAccountService.update(id, bankAccount);
        if (updatedBankAccount != null) {
            return ResponseEntity.ok(updatedBankAccount);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping(path = "/user/{userId}")
    public ResponseEntity<List<BankAccount>> getBankAccountsByUserId(@RequestHeader("Authorization") String token, @PathVariable Long userId) {
        if (!jwtTokenUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }
        List<BankAccount> bankAccounts = bankAccountService.getByUserId(userId);
        return ResponseEntity.ok(bankAccounts);
    }

    @GetMapping(path = "/user/{userId}/account/{accountId}")
    public ResponseEntity<BankAccount> getBankAccountByUserIdAndAccountId(@RequestHeader("Authorization") String token, @PathVariable Long userId, @PathVariable Long accountId) {
        if (!jwtTokenUtil.validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }
        BankAccount bankAccount = bankAccountService.getByUserIdAndAccountId(userId, accountId);
        if (bankAccount != null) {
            return ResponseEntity.ok(bankAccount);
        }
        return ResponseEntity.notFound().build();
    }
}
