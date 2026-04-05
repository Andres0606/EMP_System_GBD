package com.gbdj.backend.Service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class TipoTramiteService {

    private final RestTemplate restTemplate;

    public TipoTramiteService() {
        this.restTemplate = new RestTemplate();
    }

    // Listar todos los tipos de trámite
    public Map<String, Object> listarTiposTramite() {
        String url = "https://oracleapex.com/ords/ucc/apiTipoTramite/list";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        
        try {
            log.info("Listando tipos de trámite desde APEX: {}", url);
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error al listar tipos de trámite: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "Error al listar: " + e.getMessage());
            return errorResponse;
        }
    }

   
}