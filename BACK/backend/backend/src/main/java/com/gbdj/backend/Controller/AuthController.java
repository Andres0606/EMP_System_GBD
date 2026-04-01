package com.gbdj.backend.Controller;

import com.gbdj.backend.DTO.LoginRequest;
import com.gbdj.backend.DTO.RegisterRequest;
import com.gbdj.backend.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getCorreo() == null || loginRequest.getCorreo().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "El correo es requerido"
            ));
        }
        
        if (loginRequest.getContrasena() == null || loginRequest.getContrasena().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "La contraseña es requerida"
            ));
        }
        
        Map<String, Object> response = authService.validarLogin(
            loginRequest.getCorreo(),
            loginRequest.getContrasena()
        );
        
        if ("OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(response);
        }
    }
    
    // Nuevo endpoint para registro
   @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
    // Validaciones
    if (registerRequest.getCedula() == null) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "La cédula es requerida"
        ));
    }
    
    if (registerRequest.getNombres() == null || registerRequest.getNombres().trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "Los nombres son requeridos"
        ));
    }
    
    if (registerRequest.getApellido() == null || registerRequest.getApellido().trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "Los apellidos son requeridos"
        ));
    }
    
    if (registerRequest.getCorreo() == null || registerRequest.getCorreo().trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "El correo es requerido"
        ));
    }
    
    if (registerRequest.getContrasena() == null || registerRequest.getContrasena().trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "La contraseña es requerida"
        ));
    }
    
    // Convertir a Map para enviar a APEX
    Map<String, Object> userData = new HashMap<>();
    userData.put("P_CEDULA", registerRequest.getCedula());
    userData.put("P_NOMBRES", registerRequest.getNombres());
    userData.put("P_APELLIDO", registerRequest.getApellido());
    
    // Formatear la fecha en formato DD/MM/YYYY para APEX
    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
    String fechaStr = sdf.format(registerRequest.getFechaNacimiento());
    userData.put("P_FECHANACIMIENTO", fechaStr);
    
    userData.put("P_TELEFONO", registerRequest.getTelefono());
    userData.put("P_CORREO", registerRequest.getCorreo());
    userData.put("P_CONTRASENA", registerRequest.getContrasena());
    
    Map<String, Object> response = authService.registrarUsuario(userData);
    
    if ("OK".equals(response.get("status"))) {
        return ResponseEntity.ok(response);
    } else {
        String mensaje = response.get("mensaje").toString();
        if (mensaje.contains("cédula") || mensaje.contains("correo")) {
            return ResponseEntity.status(409).body(response);
        }
        return ResponseEntity.status(500).body(response);
    }
}
    
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "mensaje", "Backend funcionando correctamente"
        ));
    }
}