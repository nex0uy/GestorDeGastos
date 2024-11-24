package com.topicos.ucu.controllers;

import com.topicos.ucu.entities.Category;
import com.topicos.ucu.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;

    // Método para validar el token
    private boolean validateToken(String token) {
        // Lógica de validación del token
        return token != null && token.startsWith("Bearer ");
    }

    @PostMapping(path = "/create")
    public ResponseEntity<Category> createCategory(@RequestHeader("Authorization") String token, @RequestBody Category category) {
        try {
            // Validación del token
            if (!validateToken(token)) {
                return ResponseEntity.status(401).body(null);
            }

            // Validación adicional del campo categoryName
            if (category.getCategoryName() == null || category.getCategoryName().isEmpty()) {
                return ResponseEntity.badRequest().body(null); // Respuesta de error si el nombre está vacío o nulo
            }

            // Crear la categoría
            Category savedCategory = categoryService.create(category);
            return ResponseEntity.ok(savedCategory);

        } catch (Exception e) {
            // Manejo general de excepciones
            return ResponseEntity.status(500).body(null); // Error interno del servidor
        }
    }
    @PutMapping(path = "/update/{id}")
    public ResponseEntity<Category> updateCategory(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody Category category) {
        try {
            // Validación del token
            if (!validateToken(token)) {
                return ResponseEntity.status(401).body(null);
            }

            // Intentamos actualizar la categoría
            Category updatedCategory = categoryService.update(id, category);
            if (updatedCategory != null) {
                return ResponseEntity.ok(updatedCategory);
            } else {
                return ResponseEntity.status(404).body(null);  // Si no se encuentra la categoría
            }

        } catch (Exception e) {
            // Manejo general de excepciones
            return ResponseEntity.status(500).body(null); // Error interno del servidor
        }
    }


    @GetMapping(path = "/get/{id}")
    public ResponseEntity<Category> getCategoryById(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }
        Category category = categoryService.getById(id);
        if (category != null) {
            return ResponseEntity.ok(category);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping(path = "/getall")
    public ResponseEntity<List<Category>> getAllCategories(@RequestHeader("Authorization") String token) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body(null);
        }
        List<Category> categories = categoryService.getAll();
        return ResponseEntity.ok(categories);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteCategory(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        if (!validateToken(token)) {
            return ResponseEntity.status(401).body("Token inválido.");
        }
        boolean deleted = categoryService.delete(id);
        if (deleted) {
            return ResponseEntity.ok("Categoría eliminada exitosamente.");
        }
        return ResponseEntity.badRequest().body("Categoría no encontrada.");
    }
}
