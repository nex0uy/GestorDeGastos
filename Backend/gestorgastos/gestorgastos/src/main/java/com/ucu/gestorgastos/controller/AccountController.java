package com.ucu.gestorgastos.controller;

import com.ucu.gestorgastos.model.Account;
import com.ucu.gestorgastos.service.AccountService;

import com.ucu.gestorgastos.model.Transaction;
import com.ucu.gestorgastos.service.TransactionService;

import com.ucu.gestorgastos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        return new ResponseEntity<>(accountService.save(account), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return new ResponseEntity<>(accountService.findAll(), HttpStatus.OK);
    }


}
