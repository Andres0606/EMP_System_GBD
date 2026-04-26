package com.gbdj.backend.Service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class TramiteService {

    private static final Logger log = LoggerFactory.getLogger(TramiteService.class);
    private final RestTemplate restTemplate;

    public TramiteService() {
        this.restTemplate = new RestTemplate();
    }

    // Crear trámite desde cita
    public Map<String, Object> crearTramite(Map<String, Object> tramiteData) {
        String url = "https://oracleapex.com/ords/ucc/apiTramite/register";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(tramiteData, headers);
        
        try {
            log.info("Creando trámite en APEX: {}", url);
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error al crear trámite: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "Error: " + e.getMessage());
            return errorResponse;
        }
    }

    public Map<String, Object> listarPorAsesor(Long idAsesor) {
    String url = "https://oracleapex.com/ords/ucc/apiTramite/listarPorAsesor?P_ID_ASESOR=" + idAsesor;
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<String> requestEntity = new HttpEntity<>(headers);
    
    try {
        log.info("Listando trámites del asesor: {}", idAsesor);
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            requestEntity,
            Map.class
        );
        return response.getBody();
    } catch (Exception e) {
        log.error("Error al listar trámites: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
}