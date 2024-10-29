package com.ucu.gestorgastos.model;

import javax.persistence.*;

@Entity
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Nombre del presupuesto
    private Double limit; // Límite del presupuesto

    // Getters y Setters
}
