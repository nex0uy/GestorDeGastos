package com.topicos.ucu.services;

import com.topicos.ucu.entities.BankAccount;
import com.topicos.ucu.entities.User;
import com.topicos.ucu.repositories.RepositoryBankAccount;
import com.topicos.ucu.repositories.RepositoryUser;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BankAccountService {

    private final RepositoryBankAccount bankAccountRepository;
    private final RepositoryUser repositoryUser;

    public BankAccount create(BankAccount bankAccount) {
        Optional<User> userExist = repositoryUser.getUser(bankAccount.getUser().getUserId());
        if (userExist.isPresent()) {
            bankAccount.setUser(userExist.get());
            return bankAccountRepository.save(bankAccount);
        }
        return null;
    }

    public BankAccount getById(Long id) {
        Optional<BankAccount> bankAccount = bankAccountRepository.findById(id);
        return bankAccount.orElse(null);
    }

    public List<BankAccount> getAll() {
        return bankAccountRepository.findAll();
    }

    public boolean delete(Long id) {
        if (bankAccountRepository.existsById(id)) {
            bankAccountRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public BankAccount update(Long id, BankAccount updatedBankAccount) {
        Optional<BankAccount> existingBankAccount = bankAccountRepository.findById(id);
        if (existingBankAccount.isPresent()) {
            BankAccount bankAccount = existingBankAccount.get();
            bankAccount.setBankName(updatedBankAccount.getBankName());
            bankAccount.setBaseCurrency(updatedBankAccount.getBaseCurrency());
            bankAccount.setInitialBalance(updatedBankAccount.getInitialBalance());
            bankAccount.setUser(updatedBankAccount.getUser());
            return bankAccountRepository.save(bankAccount);
        }
        return null;
    }

    public List<BankAccount> getByUserId(Long userId) {
        return bankAccountRepository.findByUser_UserId(userId);
    }

    public BankAccount getByUserIdAndAccountId(Long userId, Long accountId) {
        return bankAccountRepository.findByUser_UserIdAndBankAccountId(userId, accountId);
    }


}
