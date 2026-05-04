package com.gbdj.backend.Service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.HashMap;

@Slf4j
@Service
public class ConsultaService {

    private final RestTemplate restTemplate;
    private final String baseUrl = "https://oracleapex.com/ords/ucc";

    public ConsultaService() {
        this.restTemplate = new RestTemplate();
    }

    // Crear consulta
    public Map<String, Object> crearConsulta(Map<String, Object> consultaData) {
        String url = baseUrl + "/apiConsulta/register";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(consultaData, headers);
        
        try {
            log.info("=== CREAR CONSULTA SERVICE ===");
            log.info("URL: {}", url);
            log.info("Datos enviados a APEX: {}", consultaData);
            
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
            return errorResponse;
        } catch (Exception e) {
            log.error("Error al crear consulta: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "Error: " + e.getMessage());
            return errorResponse;
        }
    }

    // Listar consultas por cliente
public Map<String, Object> listarConsultasPorCliente(Long idCliente) {
    String url = baseUrl + "/apiConsulta/listByCliente?P_ID_CLIENTE=" + idCliente;
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<String> requestEntity = new HttpEntity<>(headers);
    
    try {
        log.info("=== LISTAR CONSULTAS SERVICE ===");
        log.info("URL: {}", url);
        
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
        log.error("Error HTTP: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error HTTP: " + e.getStatusCode());
        return errorResponse;
    } catch (Exception e) {
        log.error("Error al listar consultas: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
// Listar todas las consultas (para asesor/admin)
public Map<String, Object> listarTodasConsultas() {
    String url = baseUrl + "/apiConsulta/listAll";
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<String> requestEntity = new HttpEntity<>(headers);
    
    try {
        log.info("=== LISTAR TODAS CONSULTAS SERVICE ===");
        log.info("URL: {}", url);
        
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
        log.error("Error HTTP: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error HTTP: " + e.getStatusCode());
        return errorResponse;
    } catch (Exception e) {
        log.error("Error al listar consultas: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
public Map<String, Object> responderConsulta(Map<String, Object> consultaData) {
    String url = baseUrl + "/apiConsulta/responder";
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(consultaData, headers);
    
    try {
        log.info("=== RESPONDER CONSULTA SERVICE ===");
        log.info("URL: {}", url);
        
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            Map.class
        );
        
        return response.getBody();
    } catch (Exception e) {
        log.error("Error al responder consulta: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
}