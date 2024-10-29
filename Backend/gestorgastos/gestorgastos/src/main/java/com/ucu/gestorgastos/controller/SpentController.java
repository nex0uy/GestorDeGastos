package com.ucu.gestorgastos.controller;

import com.ucu.gestorgastos.model.Spent;
import com.ucu.gestorgastos.service.SpentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/gastos")
public class SpentController {

    @Autowired
    private SpentService spentService;

    @GetMapping//Crea una lista de gastos
    public List<Spent> obtenerGastos() {
        return spentService.obtenerGastos();
    }

    @PostMapping //crea un nuevo gasto
    public ResponseEntity<Spent> crearGasto(@RequestBody Spent spent) {
        Spent nuevoGasto = spentService.crearGasto(spent);
        return ResponseEntity.ok(nuevoGasto);
    }

    // Otros métodos para actualizar y eliminar gastos
}
