package com.topicos.ucu.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "description")
    private String description;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Column(name = "is_recurrent")
    private Boolean isRecurrent;


    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "bank_account_id", referencedColumnName = "bank_account_id")
    private BankAccount bankAccount;

    // Enum para tipo de transacción
    public enum TransactionType {
        INCOME, EXPENSE
    }

    public Long getUserId() {
        return user != null ? user.getUserId() : null;
    }

    public Long getCategoryId() {
        return category != null ? category.getCategoryId() : null;
    }

    public Long getBankAccountId() {
        return bankAccount != null ? bankAccount.getBankAccountId() : null;
    }
}
