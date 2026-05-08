package com.gbdj.backend.Service;

import com.gbdj.backend.Entity.TipoTramite;
import com.gbdj.backend.Repository.TipoTramiteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class TipoTramiteService {

    private final TipoTramiteRepository tipoTramiteRepo;

    public Map<String, Object> listarTiposTramite() {
        Map<String, Object> resp = new HashMap<>();
        try {
            List<TipoTramite> lista = tipoTramiteRepo.findAll();
            List<Map<String, Object>> result = new ArrayList<>();
            for (TipoTramite t : lista) {
                Map<String, Object> item = new HashMap<>();
                item.put("idTipoTramite", t.getIdTipoTramite());
                item.put("nombre", t.getNombre());
                item.put("descripcion", t.getDescripcion());
                item.put("valorBase", t.getValorBase());
                item.put("requiereVehiculo", t.getRequiereVehiculo());
                result.add(item);
            }
            resp.put("status", "OK");
            resp.put("tipos", result);
        } catch (Exception e) {
            log.error("Error listando tipos de trámite", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }
}
