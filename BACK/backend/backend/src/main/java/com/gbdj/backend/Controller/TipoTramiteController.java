package com.gbdj.backend.Controller;

import com.gbdj.backend.Service.TipoTramiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/tipo-tramite")
@CrossOrigin(origins = "http://localhost:3000")
public class TipoTramiteController {

    @Autowired  
    private TipoTramiteService tipoTramiteService;

    @GetMapping("/list")
    public ResponseEntity<?> listarTiposTramite() {
        Map<String, Object> response = tipoTramiteService.listarTiposTramite();
        
        if (response != null && "OK".equals(response.get("status"))) {
            return ResponseEntity.ok(response);
        } else {
            String mensaje = response != null ? 
                              response.get("mensaje").toString() : "Error al listar tipos de trámite";
            return ResponseEntity.status(500).body(Map.of(
                "status", "ERROR",
                "mensaje", mensaje
            ));
        }
    }
}