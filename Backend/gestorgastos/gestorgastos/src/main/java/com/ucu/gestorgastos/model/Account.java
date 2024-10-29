package com.ucu.gestorgastos.model;

import javax.persistence.*;

@Entity
@Table(name = "\"Bank_Account\"")  // Cambia el nombre de la tabla a "Bank_Account"
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bankAccountId;

    @Column(nullable = false)
    private String bankName;

    @Column(nullable = false)
    private String baseCurrency;

    @Column(nullable = false)
    private Double initialBalance;


    @ManyToOne
    @JoinColumn(name = "user_id") // Asegúrate de que este campo se refiera al id del usuario
    private User user;

    // Getters y setters

    public Long getBankAccountId() {
        return bankAccountId;
    }

    public void setBankAccountId(Long bankAccountId) {
        this.bankAccountId = bankAccountId;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBaseCurrency() {
        return baseCurrency;
    }

    public void setBaseCurrency(String baseCurrency) {
        this.baseCurrency = baseCurrency;
    }

    public Double getInitialBalance() {
        return initialBalance;
    }

    public void setInitialBalance(Double initialBalance) {
        this.initialBalance = initialBalance;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
