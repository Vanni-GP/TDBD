package com.vannisystems.app.controller;

import com.vannisystems.app.entity.User;
import com.vannisystems.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // CRUD básico
    @GetMapping
    public List<User> getAll() {
        return userService.getAll();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getById(id);
    }

    @PostMapping
    public User save(@RequestBody User user) {
        return userService.save(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) {
        return userService.save(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }

    // 🔧 Modificación del esquema (agregar columna con constraint)
    @PutMapping("/modify-schema")
    public ResponseEntity<String> modifySchema(@RequestBody Map<String, String> body) {
        String columnName = body.get("columnName");
        String columnType = body.get("columnType");
        String constraint = body.get("constraint");

        String sql = "ALTER TABLE users ADD COLUMN " + columnName + " " + columnType;
        if (constraint != null && !constraint.isEmpty()) {
            sql += " " + constraint;
        }

        try {
            jdbcTemplate.execute(sql);
            return ResponseEntity.ok("Columna agregada: " + columnName);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 🧱 Aplicación de constraint directo
    @PutMapping("/apply-constraint")
    public ResponseEntity<String> applyConstraint(@RequestBody Map<String, String> body) {
        String sql = body.get("sql");

        try {
            jdbcTemplate.execute(sql);
            return ResponseEntity.ok("Constraint aplicado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}

