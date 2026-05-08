package com.gbdj.backend.Controller;

import com.gbdj.backend.DTO.ActualizarEstadoRequest;
import com.gbdj.backend.DTO.CrearTramiteRequest;
import com.gbdj.backend.Service.TramiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/tramite")
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
                    "mensaje", "El ID de la cita es requerido"));
        }

        if (request.getValorTramite() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "mensaje", "El valor del trámite es requerido"));
        }

        Map<String, Object> tramiteData = new HashMap<>();
        tramiteData.put("P_ID_CITA", request.getIdCita());
        tramiteData.put("P_VALOR_TRAMITE", request.getValorTramite());
        tramiteData.put("P_VALOR_OTROS_CONCEPTOS",
                request.getValorOtrosConceptos() != null ? request.getValorOtrosConceptos() : 0);

        Map<String, Object> response = tramiteService.crearTramite(tramiteData);

        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? response.get("mensaje").toString() : "Error al crear trámite";
            return ResponseEntity.status(500).body(Map.of(
                    "status", "ERROR",
                    "mensaje", mensaje));
        }
    }

    @GetMapping("/asesor/{idAsesor}")
    public ResponseEntity<?> listarTramitesPorAsesor(@PathVariable Long idAsesor) {
        log.info("=== LISTAR TRÁMITES POR ASESOR ===");
        log.info("idAsesor: {}", idAsesor);

        Map<String, Object> response = tramiteService.listarPorAsesor(idAsesor);

        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? response.get("mensaje").toString() : "Error al listar trámites";
            return ResponseEntity.status(500).body(Map.of(
                    "status", "ERROR",
                    "mensaje", mensaje));
        }
    }

    @PutMapping("/estado")
    public ResponseEntity<?> actualizarEstado(@RequestBody ActualizarEstadoRequest request) {
        log.info("=== ACTUALIZAR ESTADO TRÁMITE ===");
        log.info("idTramite: {}", request.getIdTramite());
        log.info("estado: {}", request.getEstado());

        // Validar que el estado sea válido
        List<String> estadosValidos = Arrays.asList("Activo", "En_Proceso", "Finalizado");
        if (!estadosValidos.contains(request.getEstado())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "mensaje", "Estado no válido. Use: Activo, En_Proceso o Finalizado"));
        }

        if (request.getIdTramite() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "mensaje", "El ID del trámite es requerido"));
        }

        Map<String, Object> tramiteData = new HashMap<>();
        tramiteData.put("P_ID_TRAMITE", request.getIdTramite());
        tramiteData.put("P_ESTADO", request.getEstado());

        Map<String, Object> response = tramiteService.actualizarEstado(tramiteData);

        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? response.get("mensaje").toString() : "Error al actualizar estado";
            return ResponseEntity.status(500).body(Map.of(
                    "status", "ERROR",
                    "mensaje", mensaje));
        }
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<?> listarTramitesPorCliente(@PathVariable Long idCliente) {
        log.info("=== LISTAR TRÁMITES POR CLIENTE ===");
        log.info("idCliente: {}", idCliente);

        Map<String, Object> response = tramiteService.listarPorCliente(idCliente);

        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? response.get("mensaje").toString() : "Error al listar trámites";
            return ResponseEntity.status(500).body(Map.of(
                    "status", "ERROR",
                    "mensaje", mensaje));
        }
    }
}