package com.gbdj.backend.Controller;

import com.gbdj.backend.DTO.AtenderCitaRequest;
import com.gbdj.backend.DTO.CompletarCitaRequest;
import com.gbdj.backend.DTO.SolicitarCitaRequest;
import com.gbdj.backend.Service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "http://localhost:3000")
public class CitaController {

    private static final Logger log = LoggerFactory.getLogger(CitaController.class);

    @Autowired
    private CitaService citaService;

    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitarCita(@RequestBody SolicitarCitaRequest request) {
        // Validaciones
        if (request.getIdCliente() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "El ID del cliente es requerido"
            ));
        }
        
        if (request.getIdTipoTramite() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "El tipo de trámite es requerido"
            ));
        }
        
        // Preparar datos para APEX
        Map<String, Object> citaData = new HashMap<>();
        citaData.put("P_ID_CLIENTE", request.getIdCliente());
        citaData.put("P_ID_VEHICULO", request.getIdVehiculo());
        citaData.put("P_ID_TIPO_TRAMITE", request.getIdTipoTramite());
        
        Map<String, Object> response = citaService.solicitarCita(citaData);
        
        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? 
                              response.get("mensaje").toString() : "Error al solicitar cita";
            return ResponseEntity.status(500).body(Map.of(
                "status", "ERROR",
                "mensaje", mensaje
            ));
        }
    }
    @GetMapping("/pendientes/{cedulaAsesor}")
public ResponseEntity<?> listarCitasPendientes(@PathVariable Long cedulaAsesor) {
    Map<String, Object> response = citaService.listarCitasPendientes(cedulaAsesor);
    
    if (response != null && "OK".equals(response.get("status"))) {
        return ResponseEntity.ok(response);
    } else {
        String mensaje = response != null ? 
                          response.get("mensaje").toString() : "Error al listar citas";
        return ResponseEntity.status(500).body(Map.of(
            "status", "ERROR",
            "mensaje", mensaje
        ));
    }
}
@PostMapping("/atender")
public ResponseEntity<?> atenderCita(@RequestBody AtenderCitaRequest request) {
    System.out.println("=== ATENDER CITA ===");
    System.out.println("idCita: " + request.getIdCita());
    System.out.println("idAsesor: " + request.getIdAsesor());
    System.out.println("fechaProgramada: " + request.getFechaProgramada());
    
    if (request.getIdCita() == null) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "El ID de la cita es requerido"
        ));
    }
    
    if (request.getIdAsesor() == null) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "El ID del asesor es requerido"
        ));
    }
    
    if (request.getFechaProgramada() == null || request.getFechaProgramada().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "La fecha programada es requerida"
        ));
    }
    
    Map<String, Object> citaData = new HashMap<>();
    citaData.put("P_ID_CITA", request.getIdCita());
    citaData.put("P_ID_ASESOR", request.getIdAsesor());
    
    // Convertir formato: "2024-04-05T14:30" -> "2024-04-05 14:30:00"
    String fechaStr = request.getFechaProgramada().replace('T', ' ') + ":00";
    citaData.put("P_FECHA_PROGRAMADA", fechaStr);
    
    System.out.println("Enviando a APEX: " + citaData);
    
    Map<String, Object> response = citaService.atenderCita(citaData);
    
    if (response != null && "OK".equals(response.get("status"))) {
        return ResponseEntity.ok(response);
    } else {
        String mensaje = response != null ? 
                          response.get("mensaje").toString() : "Error al atender cita";
        return ResponseEntity.status(500).body(Map.of(
            "status", "ERROR",
            "mensaje", mensaje
        ));
    }
}
@GetMapping("/agendadas/{cedulaAsesor}")
public ResponseEntity<?> listarCitasAgendadas(@PathVariable Long cedulaAsesor) {
    String url = "https://oracleapex.com/ords/ucc/apiCita/listarAgendadas?P_ID_ASESOR=" + cedulaAsesor;
    
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
        return ResponseEntity.status(500).body(Map.of(
            "status", "ERROR",
            "mensaje", e.getMessage()
        ));
    }
}
@PostMapping("/completar")
public ResponseEntity<?> completarCita(@RequestBody CompletarCitaRequest request) {
    log.info("=== COMPLETAR CITA ===");
    log.info("idCita: {}", request.getIdCita());
    
    if (request.getIdCita() == null) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "El ID de la cita es requerido"
        ));
    }
    
    Map<String, Object> citaData = new HashMap<>();
    citaData.put("P_ID_CITA", request.getIdCita());
    
    Map<String, Object> response = citaService.completarCita(citaData);
    
    if (response != null && "OK".equals(response.get("status"))) {
        return ResponseEntity.ok(response);
    } else {
        String mensaje = response != null ? 
                          response.get("mensaje").toString() : "Error al completar cita";
        return ResponseEntity.status(500).body(Map.of(
            "status", "ERROR",
            "mensaje", mensaje
        ));
    }
}
}