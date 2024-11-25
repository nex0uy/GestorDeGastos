package com.topicos.ucu.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "bank_account")
@Getter
@Setter
public class BankAccount implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bank_account_id")
    private Long bankAccountId;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "base_currency")
    private String baseCurrency;

    @Column(name = "initial_balance")
    private BigDecimal initialBalance;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    public Long getUserId() {
        return user != null ? user.getUserId() : null;
    }



}
