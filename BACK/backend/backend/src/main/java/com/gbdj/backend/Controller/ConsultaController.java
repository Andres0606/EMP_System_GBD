package com.gbdj.backend.Controller;

import com.gbdj.backend.DTO.CrearConsultaRequest;
import com.gbdj.backend.Service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.HashMap;

@Slf4j
@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    @PostMapping("/crear")
    public ResponseEntity<?> crearConsulta(@RequestBody CrearConsultaRequest request) {
        log.info("=== CREAR CONSULTA ===");
        log.info("idCliente: {}", request.getIdCliente());
        log.info("asunto: {}", request.getAsunto());
        log.info("mensaje: {}", request.getMensaje());

        // Validaciones
        if (request.getIdCliente() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "mensaje", "El ID del cliente es requerido"));
        }

        if (request.getAsunto() == null || request.getAsunto().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "mensaje", "El asunto es requerido"));
        }

        if (request.getMensaje() == null || request.getMensaje().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "mensaje", "El mensaje es requerido"));
        }

        // Preparar datos para APEX
        Map<String, Object> consultaData = new HashMap<>();
        consultaData.put("P_ID_CLIENTE", request.getIdCliente());
        consultaData.put("P_ASUNTO", request.getAsunto());
        consultaData.put("P_MENSAJE", request.getMensaje());

        log.info("Enviando a APEX: {}", consultaData);

        Map<String, Object> response = consultaService.crearConsulta(consultaData);

        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? response.get("mensaje").toString() : "Error al crear consulta";
            return ResponseEntity.status(500).body(Map.of(
                    "status", "ERROR",
                    "mensaje", mensaje));
        }
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<?> listarConsultasPorCliente(@PathVariable Long idCliente) {
        log.info("=== LISTAR CONSULTAS POR CLIENTE ===");
        log.info("idCliente: {}", idCliente);

        if (idCliente == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "mensaje", "El ID del cliente es requerido"));
        }

        Map<String, Object> response = consultaService.listarConsultasPorCliente(idCliente);

        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? response.get("mensaje").toString() : "Error al listar consultas";
            return ResponseEntity.status(500).body(Map.of(
                    "status", "ERROR",
                    "mensaje", mensaje));
        }
    }

    @GetMapping("/asesor/todas")
    public ResponseEntity<?> listarTodasConsultas() {
        log.info("=== LISTAR TODAS CONSULTAS (ASESOR) ===");

        Map<String, Object> response = consultaService.listarTodasConsultas();

        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? response.get("mensaje").toString() : "Error al listar consultas";
            return ResponseEntity.status(500).body(Map.of(
                    "status", "ERROR",
                    "mensaje", mensaje));
        }
    }

    @PostMapping("/responder")
    public ResponseEntity<?> responderConsulta(@RequestBody Map<String, Object> request) {
        log.info("=== RESPONDER CONSULTA ===");
        log.info("idConsulta: {}", request.get("idConsulta"));
        log.info("respuesta: {}", request.get("respuesta"));

        if (request.get("idConsulta") == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "mensaje", "El ID de la consulta es requerido"));
        }

        if (request.get("respuesta") == null || request.get("respuesta").toString().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "mensaje", "La respuesta es requerida"));
        }

        Map<String, Object> consultaData = new HashMap<>();
        consultaData.put("P_ID_CONSULTA", request.get("idConsulta"));
        consultaData.put("P_RESPUESTA", request.get("respuesta"));

        Map<String, Object> response = consultaService.responderConsulta(consultaData);

        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? response.get("mensaje").toString() : "Error al responder consulta";
            return ResponseEntity.status(500).body(Map.of(
                    "status", "ERROR",
                    "mensaje", mensaje));
        }
    }
}