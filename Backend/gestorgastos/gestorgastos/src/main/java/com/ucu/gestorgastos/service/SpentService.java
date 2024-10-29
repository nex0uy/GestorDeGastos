package com.ucu.gestorgastos.service;

import com.ucu.gestorgastos.model.Spent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpentService {

    @Autowired
    private com.ucu.gestorgastos.repository.SpentRepository spentRepository;

    public List<Spent> obtenerGastos() {
        return spentRepository.findAll();
    }

    public Spent crearGasto(Spent spent) {
        return spentRepository.save(spent);
    }

    // Otros métodos como actualizar y eliminar gastos
}
