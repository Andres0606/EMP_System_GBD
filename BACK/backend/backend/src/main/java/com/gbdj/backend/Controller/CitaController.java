package com.gbdj.backend.Controller;

import com.gbdj.backend.DTO.SolicitarCitaRequest;
import com.gbdj.backend.Service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "http://localhost:3000")
public class CitaController {

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
}