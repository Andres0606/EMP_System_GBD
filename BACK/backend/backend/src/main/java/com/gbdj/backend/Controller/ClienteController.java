package com.gbdj.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.gbdj.backend.Service.ClienteService;

import java.util.Map;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping("/asesor/{cedulaAsesor}")
    public ResponseEntity<?> listarClientesPorAsesor(@PathVariable Long cedulaAsesor) {
        Map<String, Object> response = clienteService.listarClientesPorAsesor(cedulaAsesor);

        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? response.get("mensaje").toString() : "Error al consultar los clientes";
            return ResponseEntity.status(500).body(Map.of(
                    "status", "ERROR",
                    "mensaje", mensaje));
        }
    }
}