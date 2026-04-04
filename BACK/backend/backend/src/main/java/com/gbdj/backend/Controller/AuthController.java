package com.gbdj.backend.Controller;

import com.gbdj.backend.DTO.LoginRequest;
import com.gbdj.backend.DTO.LoginResponse;
import com.gbdj.backend.DTO.PersonaDTO;
import com.gbdj.backend.DTO.RegisterRequest;
import com.gbdj.backend.DTO.AsesorRequest;
import com.gbdj.backend.DTO.ClienteRegisterRequest;
import com.gbdj.backend.DTO.ActualizarPerfilRequest;  // 👈 NUEVO DTO
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
        // Validaciones
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
        
        // Llamar al servicio para validar login
        Map<String, Object> response = authService.validarLogin(
            loginRequest.getCorreo(),
            loginRequest.getContrasena()
        );
        
        // Log para depuración
        System.out.println("Respuesta de APEX: " + response);
        
        // Verificar respuesta
        if (response != null && "OK".equals(response.get("status"))) {
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setStatus("OK");
            
            // Obtener cédula
            Object cedulaObj = response.get("cedula");
            if (cedulaObj != null) {
                if (cedulaObj instanceof Number) {
                    loginResponse.setCedula(((Number) cedulaObj).longValue());
                } else if (cedulaObj instanceof String) {
                    loginResponse.setCedula(Long.parseLong((String) cedulaObj));
                }
            }
            
            // Obtener nombres
            Object nombresObj = response.get("nombres");
            if (nombresObj != null) {
                loginResponse.setNombres(nombresObj.toString());
            }
            
            // Obtener apellido
            Object apellidoObj = response.get("apellido");
            if (apellidoObj != null) {
                loginResponse.setApellido(apellidoObj.toString());
            }
            
            // Obtener correo
            Object correoObj = response.get("correo");
            if (correoObj != null) {
                loginResponse.setCorreo(correoObj.toString());
            }
            
            // Obtener rol
            Object rolObj = response.get("rol");
            if (rolObj != null) {
                if (rolObj instanceof Number) {
                    loginResponse.setRol(((Number) rolObj).intValue());
                } else if (rolObj instanceof String) {
                    loginResponse.setRol(Integer.parseInt((String) rolObj));
                }
            }
            
            return ResponseEntity.ok(loginResponse);
        } else {
            String mensaje = response != null && response.get("mensaje") != null ? 
                              response.get("mensaje").toString() : "Credenciales inválidas";
            return ResponseEntity.status(401).body(Map.of(
                "status", "ERROR",
                "mensaje", mensaje
            ));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        // Validaciones de campos requeridos
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
        
        // Preparar datos para APEX
        Map<String, Object> userData = new HashMap<>();
        userData.put("P_CEDULA", registerRequest.getCedula());
        userData.put("P_NOMBRES", registerRequest.getNombres());
        userData.put("P_APELLIDO", registerRequest.getApellido());
        
        // Formatear fecha a DD/MM/YYYY
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
        String fechaStr = sdf.format(registerRequest.getFechaNacimiento());
        userData.put("P_FECHANACIMIENTO", fechaStr);
        
        userData.put("P_TELEFONO", registerRequest.getTelefono());
        userData.put("P_CORREO", registerRequest.getCorreo());
        userData.put("P_CONTRASENA", registerRequest.getContrasena());
        
        // Llamar al servicio
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

    @PostMapping("/asesor")
    public ResponseEntity<?> crearAsesor(@RequestBody AsesorRequest asesorRequest) {
        // Validaciones
        if (asesorRequest.getCedula() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "La cédula es requerida"
            ));
        }
        if (asesorRequest.getNombres() == null || asesorRequest.getNombres().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "Los nombres son requeridos"
            ));
        }
        if (asesorRequest.getApellido() == null || asesorRequest.getApellido().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "Los apellidos son requeridos"
            ));
        }
        if (asesorRequest.getFechaNacimiento() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "La fecha de nacimiento es requerida"
            ));
        }
        if (asesorRequest.getCorreo() == null || asesorRequest.getCorreo().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "El correo es requerido"
            ));
        }
        if (asesorRequest.getContrasena() == null || asesorRequest.getContrasena().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "La contraseña es requerida"
            ));
        }
        if (asesorRequest.getEspecialidadTramite() == null || asesorRequest.getEspecialidadTramite().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "La especialidad es requerida"
            ));
        }
        if (asesorRequest.getSueldo() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "El sueldo es requerido"
            ));
        }
        
        // Preparar datos para APEX
        Map<String, Object> asesorData = new HashMap<>();
        asesorData.put("cedula", asesorRequest.getCedula());
        asesorData.put("nombres", asesorRequest.getNombres());
        asesorData.put("apellido", asesorRequest.getApellido());
        asesorData.put("fechaNacimiento", asesorRequest.getFechaNacimiento());
        asesorData.put("telefono", asesorRequest.getTelefono());
        asesorData.put("correo", asesorRequest.getCorreo());
        asesorData.put("contrasena", asesorRequest.getContrasena());
        asesorData.put("especialidadTramite", asesorRequest.getEspecialidadTramite());
        asesorData.put("sueldo", asesorRequest.getSueldo());
        
        Map<String, Object> response = authService.registrarAsesor(asesorData);
        
        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? response.get("mensaje").toString() : "Error al registrar asesor";
            return ResponseEntity.status(500).body(Map.of(
                "status", "ERROR",
                "mensaje", mensaje
            ));
        }
    }

    // ✅ ENDPOINT CORREGIDO - Usa el nuevo método obtenerPersonaPorCedula
    @GetMapping("/persona/{cedula}")
    public ResponseEntity<?> buscarPersona(@PathVariable Long cedula) {
        try {
            // 👈 CAMBIADO: usar el nuevo método obtenerPersonaPorCedula
            Map<String, Object> response = authService.obtenerPersonaPorCedula(cedula);
            
            if (response != null && "OK".equals(response.get("status"))) {
                PersonaDTO personaDTO = new PersonaDTO();
                personaDTO.setStatus("OK");
                
                Object cedulaObj = response.get("cedula");
                if (cedulaObj instanceof Number) {
                    personaDTO.setCedula(((Number) cedulaObj).longValue());
                }
                
                personaDTO.setNombres((String) response.get("nombres"));
                personaDTO.setApellido((String) response.get("apellido"));
                personaDTO.setCorreo((String) response.get("correo"));
                
                Object rolObj = response.get("rol");
                if (rolObj instanceof Number) {
                    personaDTO.setRol(((Number) rolObj).intValue());
                }
                
                return ResponseEntity.ok(personaDTO);
            } else {
                String mensaje = response != null && response.get("mensaje") != null ? 
                                  response.get("mensaje").toString() : "Persona no encontrada";
                return ResponseEntity.status(404).body(Map.of(
                    "status", "ERROR",
                    "mensaje", mensaje
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "status", "ERROR",
                "mensaje", "Error interno del servidor: " + e.getMessage()
            ));
        }
    }
    
    // ✅ NUEVO ENDPOINT - Obtener perfil completo para edición
    @GetMapping("/perfil/{cedula}")
    public ResponseEntity<?> obtenerPerfil(@PathVariable Long cedula) {
        try {
            Map<String, Object> response = authService.obtenerPersonaPorCedula(cedula);
            
            if (response != null && "OK".equals(response.get("status"))) {
                return ResponseEntity.ok(response);
            } else {
                String mensaje = response != null && response.get("mensaje") != null ? 
                                  response.get("mensaje").toString() : "Persona no encontrada";
                return ResponseEntity.status(404).body(Map.of(
                    "status", "ERROR",
                    "mensaje", mensaje
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "status", "ERROR",
                "mensaje", "Error interno del servidor: " + e.getMessage()
            ));
        }
    }
    
    // ✅ NUEVO ENDPOINT - Actualizar perfil
    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(@RequestBody ActualizarPerfilRequest request) {
        // Validaciones
        if (request.getCedula() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "La cédula es requerida"
            ));
        }
        
        // Preparar datos para APEX
        Map<String, Object> perfilData = new HashMap<>();
        perfilData.put("P_CEDULA", request.getCedula());
        perfilData.put("P_NOMBRES", request.getNombres());
        perfilData.put("P_APELLIDO", request.getApellido());
        perfilData.put("P_CORREO", request.getCorreo());
        perfilData.put("P_LICENCIACONDUCCION", request.getLicenciaConduccion());
        
        if (request.getFechaNacimiento() != null) {
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
            perfilData.put("P_FECHANACIMIENTO", sdf.format(request.getFechaNacimiento()));
        }
        
        if (request.getTelefono() != null) {
            perfilData.put("P_TELEFONO", request.getTelefono());
        }
        
        if (request.getContrasena() != null && !request.getContrasena().trim().isEmpty()) {
            perfilData.put("P_CONTRASENA", request.getContrasena());
        }
        
        Map<String, Object> response = authService.actualizarPerfil(perfilData);
        
        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? 
                              response.get("mensaje").toString() : "Error al actualizar perfil";
            return ResponseEntity.status(500).body(Map.of(
                "status", "ERROR",
                "mensaje", mensaje
            ));
        }
    }
    
    @GetMapping("/asesores")
    public ResponseEntity<?> listarAsesores() {
        try {
            Map<String, Object> response = authService.listarAsesores();
            
            if (response != null && "OK".equals(response.get("status"))) {
                return ResponseEntity.ok(response);
            } else {
                String mensaje = response != null ? 
                                  response.get("mensaje").toString() : "Error al listar asesores";
                return ResponseEntity.status(500).body(Map.of(
                    "status", "ERROR",
                    "mensaje", mensaje
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "status", "ERROR",
                "mensaje", "Error interno del servidor: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/register/cliente")
    public ResponseEntity<?> registerCliente(@RequestBody ClienteRegisterRequest request) {
        // Validaciones
        if (request.getCedula() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "La cédula es requerida"
            ));
        }
        if (request.getNombres() == null || request.getNombres().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "Los nombres son requeridos"
            ));
        }
        if (request.getApellido() == null || request.getApellido().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "Los apellidos son requeridos"
            ));
        }
        if (request.getCorreo() == null || request.getCorreo().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "El correo es requerido"
            ));
        }
        if (request.getContrasena() == null || request.getContrasena().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "La contraseña es requerida"
            ));
        }
        
        // Preparar datos para APEX
        Map<String, Object> clienteData = new HashMap<>();
        clienteData.put("P_CEDULA", request.getCedula());
        clienteData.put("P_NOMBRES", request.getNombres());
        clienteData.put("P_APELLIDO", request.getApellido());
        
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
        String fechaStr = sdf.format(request.getFechaNacimiento());
        clienteData.put("P_FECHANACIMIENTO", fechaStr);
        
        clienteData.put("P_TELEFONO", request.getTelefono());
        clienteData.put("P_CORREO", request.getCorreo());
        clienteData.put("P_CONTRASENA", request.getContrasena());
        clienteData.put("P_LICENCIACONDUCCION", request.getLicenciaConduccion());
        clienteData.put("P_TIPOUSUARIO", request.getTipoUsuario() != null ? request.getTipoUsuario() : 1);
        
        // Llamar al servicio
        Map<String, Object> response = authService.registrarCliente(clienteData);
        
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
    
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "message", "Backend funcionando correctamente",
            "timestamp", System.currentTimeMillis()
        ));
    }
    
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "mensaje", "Backend funcionando correctamente"
        ));
    }
}