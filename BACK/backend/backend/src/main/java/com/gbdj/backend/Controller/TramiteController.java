package com.gbdj.backend.Controller;

import com.gbdj.backend.DTO.CrearTramiteRequest;
import com.gbdj.backend.Service.TramiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/tramite")
@CrossOrigin(origins = "http://localhost:3000")
public class TramiteController {

    private static final Logger log = LoggerFactory.getLogger(TramiteController.class);

    @Autowired
    private TramiteService tramiteService;

    @PostMapping("/register")
    public ResponseEntity<?> crearTramite(@RequestBody CrearTramiteRequest request) {
        log.info("=== CREAR TRÁMITE ===");
        log.info("idCita: {}", request.getIdCita());
        log.info("valorTramite: {}", request.getValorTramite());
        log.info("valorOtrosConceptos: {}", request.getValorOtrosConceptos());
        
        if (request.getIdCita() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "El ID de la cita es requerido"
            ));
        }
        
        if (request.getValorTramite() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "ERROR",
                "mensaje", "El valor del trámite es requerido"
            ));
        }
        
        Map<String, Object> tramiteData = new HashMap<>();
        tramiteData.put("P_ID_CITA", request.getIdCita());
        tramiteData.put("P_VALOR_TRAMITE", request.getValorTramite());
        tramiteData.put("P_VALOR_OTROS_CONCEPTOS", request.getValorOtrosConceptos() != null ? 
                        request.getValorOtrosConceptos() : 0);
        
        Map<String, Object> response = tramiteService.crearTramite(tramiteData);
        
        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? 
                            response.get("mensaje").toString() : "Error al crear trámite";
            return ResponseEntity.status(500).body(Map.of(
                "status", "ERROR",
                "mensaje", mensaje
            ));
        }
    }
}