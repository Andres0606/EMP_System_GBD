package com.gbdj.backend.Service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class VehiculoService {

    private final RestTemplate restTemplate;

    public VehiculoService() {
        this.restTemplate = new RestTemplate();
    }

    // Registrar vehículo (POST)
    public Map<String, Object> registrarVehiculo(Map<String, Object> vehiculoData) {
        String url = "https://oracleapex.com/ords/ucc/apiVehiculo/register";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(vehiculoData, headers);
        
        try {
            log.info("Registrando vehículo en APEX: {}", url);
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );
            log.info("Respuesta de APEX: {}", response.getBody());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error en registro de vehículo: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("mensaje", "Error en el registro: " + e.getMessage());
            return errorResponse;
        }
    }

    // Listar vehículos por cliente (GET)
    public Map<String, Object> listarVehiculosPorCliente(Long idCliente) {
        String url = "https://oracleapex.com/ords/ucc/apiVehiculo/listByCliente?P1_CEDULACLIENTE=" + idCliente;
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        
        try {
            log.info("Listando vehículos del cliente: {}", idCliente);
            log.info("URL: {}", url);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                Map.class
            );
            
            log.info("Respuesta de APEX: {}", response.getBody());
            
            // Si la respuesta es exitosa, devolverla
            if (response.getBody() != null && "OK".equals(response.getBody().get("status"))) {
                return response.getBody();
            } else {
                // Si no hay vehículos o hay error, devolver arreglo vacío
                Map<String, Object> emptyResponse = new HashMap<>();
                emptyResponse.put("status", "OK");
                emptyResponse.put("vehiculos", new ArrayList<>());
                return emptyResponse;
            }
            
        } catch (HttpClientErrorException e) {
            log.error("Error HTTP al listar vehículos: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            // Devolver arreglo vacío en lugar de error
            Map<String, Object> emptyResponse = new HashMap<>();
            emptyResponse.put("status", "OK");
            emptyResponse.put("vehiculos", new ArrayList<>());
            return emptyResponse;
        } catch (Exception e) {
            log.error("Error inesperado al listar vehículos: ", e);
            // Devolver arreglo vacío en lugar de error
            Map<String, Object> emptyResponse = new HashMap<>();
            emptyResponse.put("status", "OK");
            emptyResponse.put("vehiculos", new ArrayList<>());
            return emptyResponse;
        }
    }

    public Map<String, Object> actualizarVehiculo(Map<String, Object> vehiculoData) {
    String url = "https://oracleapex.com/ords/ucc/apiVehiculo/actualizar";
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(vehiculoData, headers);
    
    try {
        log.info("Actualizando vehículo en APEX: {}", url);
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            Map.class
        );
        return response.getBody();
    } catch (Exception e) {
        log.error("Error al actualizar vehículo: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
public Map<String, Object> realizarTraspaso(Map<String, Object> traspasoData) {
    String url = "https://oracleapex.com/ords/ucc/apiVehiculo/traspaso";
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(traspasoData, headers);
    
    try {
        log.info("=== REALIZAR TRASPASO SERVICE ===");
        log.info("URL: {}", url);
        log.info("Datos enviados a APEX: {}", traspasoData);
        
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
        log.error("Error en traspaso: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
public Map<String, Object> cancelarMatricula(Map<String, Object> cancelacionData) {
    String url = "https://oracleapex.com/ords/ucc/apiVehiculo/cancelarMatricula";
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(cancelacionData, headers);
    
    try {
        log.info("Cancelando matrícula en APEX: {}", url);
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            Map.class
        );
        return response.getBody();
    } catch (Exception e) {
        log.error("Error en cancelación: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
public Map<String, Object> rematricular(Map<String, Object> rematriculaData) {
    String url = "https://oracleapex.com/ords/ucc/apiVehiculo/rematricular";
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(rematriculaData, headers);
    
    try {
        log.info("Realizando rematrícula en APEX: {}", url);
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            Map.class
        );
        return response.getBody();
    } catch (Exception e) {
        log.error("Error en rematrícula: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
public Map<String, Object> inscribirPrenda(Map<String, Object> prendaData) {
    String url = "https://oracleapex.com/ords/ucc/apiVehiculo/inscribirPrenda";
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(prendaData, headers);
    
    try {
        log.info("Inscribiendo prenda en APEX: {}", url);
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            Map.class
        );
        return response.getBody();
    } catch (Exception e) {
        log.error("Error en inscripción de prenda: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
public Map<String, Object> levantarPrenda(Map<String, Object> prendaData) {
    String url = "https://oracleapex.com/ords/ucc/apiVehiculo/levantarPrenda";
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(prendaData, headers);
    
    try {
        log.info("Levantando prenda en APEX: {}", url);
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            Map.class
        );
        return response.getBody();
    } catch (Exception e) {
        log.error("Error en levantamiento de prenda: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
public Map<String, Object> registrarHistorial(Map<String, Object> historialData) {
    String url = "https://oracleapex.com/ords/ucc/apiHistorial/register";
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    
    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(historialData, headers);
    
    try {
        log.info("Registrando historial en APEX: {}", url);
        log.info("Datos: {}", historialData);
        
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            Map.class
        );
        
        return response.getBody();
    } catch (Exception e) {
        log.error("Error al registrar historial: ", e);
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "ERROR");
        errorResponse.put("mensaje", "Error: " + e.getMessage());
        return errorResponse;
    }
}
}