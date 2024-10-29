package com.ucu.gestorgastos.model;

import javax.persistence.*;

@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // Tipo: "gasto" o "ingreso"
    private Double amount; // Monto de la transacción
    private String description; // Descripción de la transacción

    public void setId(Long id) {
    }

    // Getters y Setters
}
