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
        String url = baseUrl + "/login";
        
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
    
    // Método para registrar usuario normal (cliente)
    public Map<String, Object> registrarUsuario(Map<String, Object> userData) {
        String url = baseUrl + "/register";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(userData, headers);
        
        try {
            log.info("Enviando petición de registro a APEX: {}", url);
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );
            
            return response.getBody();
            
        } catch (Exception e) {
            log.error("Error en registro: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "Error en el registro: " + e.getMessage());
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
    // Método para buscar persona por cédula
    public Map<String, Object> buscarPersonaPorCedula(Long cedula) {
        String url = "https://oracleapex.com/ords/ucc/apiPersona/getByCedula";
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("cedula", cedula);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
        
        try {
            log.info("Buscando persona con cédula: {}", cedula);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );
            
            log.info("Respuesta de APEX: {}", response.getBody());
            return response.getBody();
            
        } catch (HttpClientErrorException e) {
            log.error("Error HTTP al buscar persona: {}", e.getStatusCode());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            
            try {
                Map<String, Object> errorBody = e.getResponseBodyAs(Map.class);
                if (errorBody != null && errorBody.containsKey("mensaje")) {
                    errorResponse.put("mensaje", errorBody.get("mensaje"));
                } else {
                    errorResponse.put("mensaje", "Persona no encontrada");
                }
            } catch (Exception ex) {
                errorResponse.put("mensaje", "Persona no encontrada");
            }
            return errorResponse;
            
        } catch (Exception e) {
            log.error("Error inesperado al buscar persona: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "Error de conexión: " + e.getMessage());
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
}