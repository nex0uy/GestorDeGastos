package com.ucu.gestorgastos.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
public class ReportController {
    @GetMapping
    public String generateReport() {
        // Lógica para generar reportes
        return "Report generated"; // Puedes cambiar esto para devolver un objeto más complejo.
    }
}
