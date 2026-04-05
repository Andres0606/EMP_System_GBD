package com.gbdj.backend.Service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class CitaService {

    private final RestTemplate restTemplate;

    public CitaService() {
        this.restTemplate = new RestTemplate();
    }

    // Solicitar cita
    public Map<String, Object> solicitarCita(Map<String, Object> citaData) {
        String url = "https://oracleapex.com/ords/ucc/apiCita/solicitar";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(citaData, headers);
        
        try {
            log.info("Solicitando cita en APEX: {}", url);
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );
            log.info("Respuesta de APEX: {}", response.getBody());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error al solicitar cita: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "Error al solicitar cita: " + e.getMessage());
            return errorResponse;
        }
    }
    public Map<String, Object> listarCitasPendientes(Long cedulaAsesor) {
    String url = "https://oracleapex.com/ords/ucc/apiCita/listarPendientes?P_CEDULA_ASESOR=" + cedulaAsesor;
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<String> requestEntity = new HttpEntity<>(headers);
    
    try {
        log.info("Listando citas pendientes para asesor: {}", cedulaAsesor);
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            requestEntity,
            Map.class
        );
        return response.getBody();
    } catch (Exception e) {
        log.error("Error al listar citas pendientes: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
public Map<String, Object> atenderCita(Map<String, Object> citaData) {
    String url = "https://oracleapex.com/ords/ucc/apiCita/atender";
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(citaData, headers);
    
    try {
        log.info("=== ATENDER CITA SERVICE ===");
        log.info("URL: {}", url);
        log.info("Datos enviados a APEX: {}", citaData);
        
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
        errorResponse.put("mensaje", "Error HTTP: " + e.getResponseBodyAsString());
        return errorResponse;
    } catch (Exception e) {
        log.error("Error al atender cita: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
// Listar citas agendadas por asesor
public Map<String, Object> listarCitasAgendadas(Long cedulaAsesor) {
    String url = "https://oracleapex.com/ords/ucc/apiCita/listarAgendadas?P_ID_ASESOR=" + cedulaAsesor;
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<String> requestEntity = new HttpEntity<>(headers);
    
    try {
        log.info("Listando citas agendadas del asesor: {}", cedulaAsesor);
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            requestEntity,
            Map.class
        );
        return response.getBody();
    } catch (Exception e) {
        log.error("Error al listar citas agendadas: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
}