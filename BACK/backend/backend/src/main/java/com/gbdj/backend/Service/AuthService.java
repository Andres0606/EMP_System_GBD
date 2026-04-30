package com.gbdj.backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import java.util.Map;
import java.util.HashMap;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AuthService {

    @Value("${apex.api.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate;

    public AuthService() {
        this.restTemplate = new RestTemplate();
    }

    // Método para validar login
   public Map<String, Object> validarLogin(String correo, String contrasena) {
    String url = "https://oracleapex.com/ords/ucc/apiPersona/login";
    
    Map<String, String> requestBody = new HashMap<>();
    requestBody.put("correo", correo);
    requestBody.put("contrasena", contrasena);
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
    
    try {
        log.info("Enviando petición a APEX: {}", url);
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            Map.class
        );
        
        log.info("Respuesta de APEX: {}", response.getBody());
        return response.getBody();
        
    } catch (HttpClientErrorException e) {
        log.error("Error HTTP: {}", e.getStatusCode());
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Credenciales inválidas");
        return errorResponse;
    } catch (Exception e) {
        log.error("Error inesperado: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error de conexión con el servidor");
        return errorResponse;
    }
}
        
    // Método para registrar asesor
    public Map<String, Object> registrarAsesor(Map<String, Object> asesorData) {
        String url = "https://oracleapex.com/ords/ucc/apiAsesor/register";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(asesorData, headers);
        
        try {
            log.info("Enviando petición de registro de asesor a APEX: {}", url);
            log.debug("Datos del asesor: {}", asesorData);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );
            
            log.info("Respuesta de APEX: {}", response.getBody());
            
            // Si la respuesta es exitosa
            if (response.getBody() != null) {
                return response.getBody();
            } else {
                Map<String, Object> successResponse = new HashMap<>();
                successResponse.put("status", "OK");
                successResponse.put("mensaje", "Asesor registrado exitosamente");
                return successResponse;
            }
            
        } catch (HttpClientErrorException e) {
            log.error("Error HTTP en registro de asesor: {}", e.getStatusCode());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            
            // Intentar obtener el mensaje de error de la respuesta
            try {
                Map<String, Object> errorBody = e.getResponseBodyAs(Map.class);
                if (errorBody != null && errorBody.containsKey("mensaje")) {
                    errorResponse.put("mensaje", errorBody.get("mensaje"));
                } else {
                    errorResponse.put("mensaje", "Error al registrar asesor: " + e.getMessage());
                }
            } catch (Exception ex) {
                errorResponse.put("mensaje", "Error al registrar asesor");
            }
            return errorResponse;
            
        } catch (Exception e) {
            log.error("Error inesperado en registro de asesor: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "Error de conexión con el servidor: " + e.getMessage());
            return errorResponse;
        }
    }
    
    // ✅ NUEVO MÉTODO CORREGIDO - Reemplaza a buscarPersonaPorCedula
    public Map<String, Object> obtenerPersonaPorCedula(Long cedula) {
        // Validar que la cédula no sea nula
        if (cedula == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "La cédula no puede ser nula");
            return errorResponse;
        }
        
        // Usar GET con parámetro en la URL
        String url = "https://oracleapex.com/ords/ucc/apiPersona/getByCedula?P_CEDULA=" + cedula;
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        
        try {
            log.info("Obteniendo persona con cédula: {}", cedula);
            log.info("URL: {}", url);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                Map.class
            );
            
            log.info("Respuesta de APEX: {}", response.getBody());
            return response.getBody();
            
        } catch (Exception e) {
            log.error("Error al obtener persona: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "Error: " + e.getMessage());
            return errorResponse;
        }
    }
    
    // Método para listar todos los asesores
    public Map<String, Object> listarAsesores() {
        String url = "https://oracleapex.com/ords/ucc/apiAsesor/list";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        
        try {
            log.info("Listando asesores desde APEX: {}", url);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                Map.class
            );
            
            log.info("Status code: {}", response.getStatusCode());
            log.info("Respuesta de APEX: {}", response.getBody());
            
            return response.getBody();
            
        } catch (HttpClientErrorException e) {
            log.error("Error HTTP al listar asesores: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "Error al listar asesores: " + e.getResponseBodyAsString());
            return errorResponse;
            
        } catch (Exception e) {
            log.error("Error inesperado al listar asesores: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "Error de conexión: " + e.getMessage());
            return errorResponse;
        }
    }
    
   public Map<String, Object> registrarCliente(Map<String, Object> clienteData) {
    String url = "https://oracleapex.com/ords/ucc/apiCliente/register";
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(clienteData, headers);
    
    try {
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            Map.class
        );
        return response.getBody();
    } catch (Exception e) {
        log.error("Error en registro de cliente: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
    
    // Método para actualizar perfil (agregar después)
   public Map<String, Object> actualizarPerfil(Map<String, Object> perfilData) {
    String url = "https://oracleapex.com/ords/ucc/apiPersona/update";
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(perfilData, headers);
    
    try {
        log.info("=== ACTUALIZAR PERFIL SERVICE ===");
        log.info("URL: {}", url);
        log.info("Datos enviados a APEX: {}", perfilData);
        
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            Map.class
        );
        
        log.info("Status code: {}", response.getStatusCode());
        log.info("Respuesta de APEX: {}", response.getBody());
        return response.getBody();
        
    } catch (HttpClientErrorException e) {
        log.error("Error HTTP: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error HTTP: " + e.getStatusCode());
        errorResponse.put("detalle", e.getResponseBodyAsString());
        return errorResponse;
    } catch (Exception e) {
        log.error("Error en actualizarPerfil: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
}