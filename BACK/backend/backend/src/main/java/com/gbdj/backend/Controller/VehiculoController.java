package com.gbdj.backend.Controller;

import com.gbdj.backend.Service.VehiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/vehiculos")
@CrossOrigin(origins = "http://localhost:3000")
public class VehiculoController {

    private static final Logger log = LoggerFactory.getLogger(VehiculoController.class);

    @Autowired
    private VehiculoService vehiculoService;

   @PostMapping("/register")
public ResponseEntity<?> registrarVehiculo(@RequestBody Map<String, Object> request) {
    log.info("=== REGISTRAR VEHÍCULO ===");
    log.info("Request recibido: {}", request);
    
    // Validaciones
    if (request.get("placa") == null || request.get("placa").toString().trim().isEmpty()) {
        log.error("Placa requerida");
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "La placa es requerida"
        ));
    }
    
    if (request.get("idCliente") == null) {
        log.error("ID Cliente requerido");
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "El ID del cliente es requerido"
        ));
    }
    
    // Preparar datos para APEX
    Map<String, Object> vehiculoData = new HashMap<>();
    vehiculoData.put("P1_PLACA", request.get("placa"));
    vehiculoData.put("P1_CEDULACLIENTE", request.get("idCliente"));
    vehiculoData.put("P1_MARCA", request.get("marca"));
    vehiculoData.put("P1_LINEA", request.get("linea"));
    vehiculoData.put("P1_MODELO", request.get("modelo"));
    vehiculoData.put("P1_CLASE", request.get("clase"));
    vehiculoData.put("P1_TIPOSERVICIO", request.get("tipoServicio"));
    vehiculoData.put("P1_NUMMOTOR", request.get("numMotor"));
    vehiculoData.put("P1_NUMCHASIS", request.get("numChasis"));
    
    log.info("Enviando a APEX: {}", vehiculoData);
    
    Map<String, Object> response = vehiculoService.registrarVehiculo(vehiculoData);
    
    if (response != null && "OK".equals(response.get("status"))) {
        return ResponseEntity.ok(response);
    } else {
        String mensaje = response != null ? 
                          response.get("mensaje").toString() : "Error al registrar vehículo";
        return ResponseEntity.status(500).body(Map.of(
            "status", "ERROR",
            "mensaje", mensaje
        ));
    }
}

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<?> listarVehiculosPorCliente(@PathVariable Long idCliente) {
        log.info("=== LISTAR VEHÍCULOS ===");
        log.info("ID Cliente: {}", idCliente);
        
        try {
            Map<String, Object> response = vehiculoService.listarVehiculosPorCliente(idCliente);
            log.info("Respuesta procesada: {}", response);
            
            // Siempre devolver OK, incluso si no hay vehículos
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error en controller: ", e);
            // Devolver arreglo vacío en caso de error
            Map<String, Object> emptyResponse = new HashMap<>();
            emptyResponse.put("status", "OK");
            emptyResponse.put("vehiculos", new java.util.ArrayList<>());
            return ResponseEntity.ok(emptyResponse);
        }
    }

    @PutMapping("/{placa}")
public ResponseEntity<?> actualizarVehiculo(@PathVariable String placa, @RequestBody Map<String, Object> updates) {
    log.info("=== ACTUALIZAR VEHÍCULO ===");
    log.info("Placa: {}", placa);
    log.info("Updates: {}", updates);
    
    // Preparar datos para APEX
    Map<String, Object> vehiculoData = new HashMap<>();
    vehiculoData.put("P_PLACA_ORIGINAL", placa);
    
    if (updates.containsKey("color")) {
        vehiculoData.put("P_COLOR", updates.get("color"));
    }
    if (updates.containsKey("tipoServicio")) {
        vehiculoData.put("P_TIPO_SERVICIO", updates.get("tipoServicio"));
    }
    if (updates.containsKey("numMotor")) {
        vehiculoData.put("P_NUM_MOTOR", updates.get("numMotor"));
    }
    if (updates.containsKey("numChasis")) {
        vehiculoData.put("P_NUM_CHASIS", updates.get("numChasis"));
    }
    if (updates.containsKey("placa")) {
        vehiculoData.put("P_NUEVA_PLACA", updates.get("placa"));
    }
    if (updates.containsKey("clase")) {
        vehiculoData.put("P_CLASE", updates.get("clase"));
    }
    
    Map<String, Object> response = vehiculoService.actualizarVehiculo(vehiculoData);
    
    if (response != null && "OK".equals(response.get("status"))) {
        return ResponseEntity.ok(response);
    } else {
        String mensaje = response != null ? response.get("mensaje").toString() : "Error al actualizar";
        return ResponseEntity.status(500).body(Map.of("status", "ERROR", "mensaje", mensaje));
    }
}

@PostMapping("/traspaso")
public ResponseEntity<?> realizarTraspaso(@RequestBody Map<String, Object> request) {
    log.info("=== REALIZAR TRASPASO ===");
    log.info("Request recibido: {}", request);
    
    // Validaciones
    if (request.get("placa") == null || request.get("placa").toString().trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "La placa es requerida"
        ));
    }
    
    if (request.get("cedulaAnterior") == null) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "La cédula del propietario actual es requerida"
        ));
    }
    
    if (request.get("cedulaNueva") == null) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "La cédula del nuevo propietario es requerida"
        ));
    }
    
    if (request.get("idTramite") == null) {
        return ResponseEntity.badRequest().body(Map.of(
            "status", "ERROR",
            "mensaje", "El ID del trámite es requerido"
        ));
    }
    
    // Preparar datos para APEX
    Map<String, Object> traspasoData = new HashMap<>();
    traspasoData.put("P_PLACA", request.get("placa"));
    traspasoData.put("P_CEDULA_ANTERIOR", request.get("cedulaAnterior"));
    traspasoData.put("P_CEDULA_NUEVA", request.get("cedulaNueva"));
    traspasoData.put("P_ID_TRAMITE", request.get("idTramite"));
    
    log.info("Enviando a APEX: {}", traspasoData);
    
    Map<String, Object> response = vehiculoService.realizarTraspaso(traspasoData);
    
    if (response != null && "OK".equals(response.get("status"))) {
        return ResponseEntity.ok(response);
    } else {
        String mensaje = response != null ? 
                          response.get("mensaje").toString() : "Error al realizar traspaso";
        return ResponseEntity.status(500).body(Map.of(
            "status", "ERROR",
            "mensaje", mensaje
        ));
    }
}
@GetMapping("/{placa}/propietario")
public ResponseEntity<?> obtenerPropietario(@PathVariable String placa) {
    log.info("=== OBTENER PROPIETARIO DEL VEHÍCULO ===");
    log.info("Placa: {}", placa);
    
    try {
        Map<String, Object> response = vehiculoService.obtenerPropietarioPorPlaca(placa);
        
        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? 
                              response.get("mensaje").toString() : "Propietario no encontrado";
            return ResponseEntity.status(404).body(Map.of(
                "status", "ERROR",
                "mensaje", mensaje
            ));
        }
    } catch (Exception e) {
        log.error("Error en controlador: ", e);
        return ResponseEntity.status(500).body(Map.of(
            "status", "ERROR",
            "mensaje", "Error interno: " + e.getMessage()
        ));
    }
}
}