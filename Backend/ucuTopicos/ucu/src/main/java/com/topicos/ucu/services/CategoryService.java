package com.topicos.ucu.services;

import com.topicos.ucu.entities.Category;
import com.topicos.ucu.repositories.RepositoryCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final RepositoryCategory categoryRepository;


    public Category create(Category category) {
        return categoryRepository.save(category);
    }

    public Category update(Long id, Category category) {
        Optional<Category> existingCategory = categoryRepository.findById(id);
        if (existingCategory.isPresent()) {
            Category updatedCategory = existingCategory.get();
            updatedCategory.setCategoryName(category.getCategoryName());
            return categoryRepository.save(updatedCategory);
        }
        return null;
    }

    public Category getById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.orElse(null);
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public boolean delete(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}