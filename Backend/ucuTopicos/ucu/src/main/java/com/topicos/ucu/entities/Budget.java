package com.topicos.ucu.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
@Entity
@Table(name = "budget")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long budgetId;

    @Column(name = "max_amount", nullable = false)
    private BigDecimal maxAmount;

    @Column(name = "alert_triggered", nullable = false)
    private Boolean alertTriggered;

    @Column(name = "initial_date", nullable = false)
    private LocalDate initialDate;
    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    public boolean isBudgetExceeded(BigDecimal totalSpent) {
        return totalSpent.compareTo(this.maxAmount) >= 0;
    }
    public Long getUserId() {
        return user != null ? user.getUserId() : null;
    }
}
