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
    
    // Nuevo método para registrar usuario
    public Map<String, Object> registrarUsuario(Map<String, Object> userData) {
        String url = baseUrl + "/register";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(userData, headers);
        
        try {
            log.info("Enviando petición de registro a APEX: {}", url);
            log.debug("Body: {}", userData);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );
            
            log.info("Respuesta de registro: {}", response.getBody());
            return response.getBody();
            
        } catch (HttpClientErrorException e) {
            log.error("Error HTTP en registro: {}", e.getStatusCode());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            
            // Intentar extraer mensaje de error del cuerpo de la respuesta
            try {
                Map<String, Object> errorBody = e.getResponseBodyAs(Map.class);
                if (errorBody != null && errorBody.containsKey("mensaje")) {
                    errorResponse.put("mensaje", errorBody.get("mensaje"));
                } else {
                    errorResponse.put("mensaje", "Error en el registro");
                }
            } catch (Exception ex) {
                errorResponse.put("mensaje", "Error en el registro");
            }
            
            return errorResponse;
            
        } catch (Exception e) {
            log.error("Error inesperado en registro: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "Error de conexión con el servidor");
            return errorResponse;
        }
    }
}