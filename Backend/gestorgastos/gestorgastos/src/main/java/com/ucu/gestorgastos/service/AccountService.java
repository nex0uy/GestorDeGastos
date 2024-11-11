package com.ucu.gestorgastos.service;

import com.ucu.gestorgastos.model.Account;
import com.ucu.gestorgastos.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    // Método para guardar una cuenta bancaria
    public Account save(Account account) {
        // Validaciones pueden ir aquí
        return accountRepository.save(account);
    }

    // Método para obtener todas las cuentas bancarias
    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    // Método para encontrar una cuenta por ID
    public Optional<Account> findById(Long id) {
        return accountRepository.findById(id);
    }

    // Método para eliminar una cuenta por ID
    public void deleteById(Long id) {
        accountRepository.deleteById(id);
    }
}
