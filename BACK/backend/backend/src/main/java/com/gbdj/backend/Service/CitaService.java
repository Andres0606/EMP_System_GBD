package com.gbdj.backend.Service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
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
}