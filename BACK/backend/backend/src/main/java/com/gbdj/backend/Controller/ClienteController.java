package com.gbdj.backend.Controller;

import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:3000")
public class ClienteController {

    @GetMapping("/asesor/{cedulaAsesor}")
    public ResponseEntity<?> listarClientesPorAsesor(@PathVariable Long cedulaAsesor) {

        String url = "https://oracleapex.com/ords/ucc/apiCliente/listarPorAsesor?P_ID_ASESOR=" + cedulaAsesor;

        try {
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                Map.class
            );

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "ERROR");
            error.put("mensaje", "Error al consultar los clientes: " + e.getMessage());

            return ResponseEntity.status(500).body(error);
        }
    }
}