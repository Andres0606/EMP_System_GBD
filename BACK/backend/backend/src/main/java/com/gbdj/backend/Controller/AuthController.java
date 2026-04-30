package com.gbdj.backend.Controller;

import com.gbdj.backend.DTO.LoginRequest;
import com.gbdj.backend.DTO.LoginResponse;
import com.gbdj.backend.DTO.PersonaDTO;

import com.gbdj.backend.DTO.AsesorRequest;
import com.gbdj.backend.DTO.ClienteRegisterRequest;
import com.gbdj.backend.DTO.ActualizarPerfilRequest;  // 👈 NUEVO DTO
import com.gbdj.backend.Service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.text.SimpleDateFormat;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
private static final Logger log = LoggerFactory.getLogger(AuthController.class);
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
    
    // Llamar al servicio
    Map<String, Object> response = authService.validarLogin(
        loginRequest.getCorreo(),
        loginRequest.getContrasena()
    );
    
    log.info("Respuesta de APEX: {}", response);
    
    if (response != null && "OK".equals(response.get("status"))) {
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setStatus("OK");
        
        // Obtener datos (nota: APEX devuelve "cedula" no "numeroDocumento")
        Object cedulaObj = response.get("cedula");
        if (cedulaObj != null) {
            if (cedulaObj instanceof Number) {
                loginResponse.setCedula(((Number) cedulaObj).longValue());
            } else if (cedulaObj instanceof String) {
                loginResponse.setCedula(Long.parseLong((String) cedulaObj));
            }
        }
        
        Object nombresObj = response.get("nombres");
        if (nombresObj != null) {
            loginResponse.setNombres(nombresObj.toString());
        }
        
        Object apellidoObj = response.get("apellido");
        if (apellidoObj != null) {
            loginResponse.setApellido(apellidoObj.toString());
        }
        
        Object correoObj = response.get("correo");
        if (correoObj != null) {
            loginResponse.setCorreo(correoObj.toString());
        }
        
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
    log.info("=== ACTUALIZAR PERFIL ===");
    log.info("Request recibido: {}", request);
    
    // Validaciones
    if (request.getNumeroDocumento() == null) {   // 👈 Cambiado
        log.error("Número de documento requerido");
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "El número de documento es requerido"
        ));
    }
    
    // Preparar datos para APEX
    Map<String, Object> perfilData = new HashMap<>();
    perfilData.put("P_CEDULA", request.getNumeroDocumento());  // 👈 APEX espera P_CEDULA
    perfilData.put("P_NOMBRES", request.getNombres());
    perfilData.put("P_APELLIDO", request.getApellido());
    perfilData.put("P_CORREO", request.getCorreo());
    perfilData.put("P_LICENCIACONDUCCION", request.getLicenciaConduccion());
    
     if (request.getFechaNacimiento() != null && !request.getFechaNacimiento().isEmpty()) {
        perfilData.put("P_FECHANACIMIENTO", request.getFechaNacimiento());
    }
    
    if (request.getTelefono() != null) {
        perfilData.put("P_TELEFONO", request.getTelefono());
    }
    
    if (request.getContrasena() != null && !request.getContrasena().trim().isEmpty()) {
        perfilData.put("P_CONTRASENA", request.getContrasena());
        log.info("Actualizando contraseña");
    }
    
    log.info("Datos a enviar a APEX: {}", perfilData);
    
    Map<String, Object> response = authService.actualizarPerfil(perfilData);
    
    log.info("Respuesta de APEX: {}", response);
    
    if (response != null && "OK".equals(response.get("status"))) {
        return ResponseEntity.ok(response);
    } else {
        String mensaje = response != null ? 
                          response.get("mensaje").toString() : "Error al actualizar perfil";
        log.error("Error actualizando perfil: {}", mensaje);
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
    log.info("=== REGISTRO CLIENTE ===");
    log.info("Request: {}", request);
    
    // Validaciones
    if (request.getNumeroDocumento() == null) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "El número de documento es requerido"
        ));
    }
    
    if (request.getTipoDocumento() == null || request.getTipoDocumento().trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "El tipo de documento es requerido"
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
    
    if (request.getFechaNacimiento() == null) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "La fecha de nacimiento es requerida"
        ));
    }
    
    // Formatear fecha a DD/MM/YYYY
    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
    String fechaStr = sdf.format(request.getFechaNacimiento());  // 👈 Esta línea faltaba
    
    // Preparar datos para APEX
    Map<String, Object> clienteData = new HashMap<>();
    clienteData.put("P_NUMERODOCUMENTO", request.getNumeroDocumento());
    clienteData.put("P_TIPODOCUMENTO", request.getTipoDocumento());
    clienteData.put("P_NOMBRES", request.getNombres());
    clienteData.put("P_APELLIDO", request.getApellido());
    clienteData.put("P_FECHANACIMIENTO", fechaStr);
    clienteData.put("P_TELEFONO", request.getTelefono());
    clienteData.put("P_CORREO", request.getCorreo());
    clienteData.put("P_CONTRASENA", request.getContrasena());
    clienteData.put("P_LICENCIACONDUCCION", request.getLicenciaConduccion() != null ? request.getLicenciaConduccion() : "N");
    clienteData.put("P_TIPOUSUARIO", request.getTipoUsuario() != null ? request.getTipoUsuario() : 1);
    
    log.info("Enviando a APEX: {}", clienteData);
    
    // Llamar al servicio
    Map<String, Object> response = authService.registrarCliente(clienteData);
    
    if ("OK".equals(response.get("status"))) {
        return ResponseEntity.ok(response);
    } else {
        String mensaje = response.get("mensaje") != null ? 
                          response.get("mensaje").toString() : "Error en el registro";
        if (mensaje.contains("número de documento") || mensaje.contains("correo")) {
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