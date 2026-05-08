package com.gbdj.backend.Service;

import com.gbdj.backend.Entity.Tramite;
import com.gbdj.backend.Repository.CitaRepository;
import com.gbdj.backend.Repository.TramiteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class TramiteService {

    private final TramiteRepository tramiteRepo;
    private final CitaRepository citaRepo;

    @Transactional
    public Map<String, Object> crearTramite(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Tramite t = new Tramite();
            t.setIdCita(toLong(data.get("P_ID_CITA")));
            t.setEstadoTramite("Activo");
            tramiteRepo.save(t);
            resp.put("status", "OK");
            resp.put("mensaje", "Trámite creado");
            resp.put("idTramite", t.getIdTramite());
        } catch (Exception e) {
            log.error("Error creando trámite", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    public Map<String, Object> listarPorAsesor(Long idAsesor) {
        Map<String, Object> resp = new HashMap<>();
        try {
            List<Tramite> lista = tramiteRepo.findByIdAsesor(idAsesor);
            resp.put("status", "OK");
            resp.put("tramites", toList(lista));
        } catch (Exception e) {
            log.error("Error listando trámites por asesor", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    public Map<String, Object> listarPorCliente(Long idCliente) {
        Map<String, Object> resp = new HashMap<>();
        try {
            List<Tramite> lista = tramiteRepo.findByIdCliente(idCliente);
            resp.put("status", "OK");
            resp.put("tramites", toList(lista));
        } catch (Exception e) {
            log.error("Error listando trámites por cliente", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    @Transactional
    public Map<String, Object> actualizarEstado(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Long idTramite = toLong(data.get("P_ID_TRAMITE"));
            String nuevoEstado = (String) data.get("P_ESTADO");
            Tramite t = tramiteRepo.findById(idTramite).orElseThrow();
            t.setEstadoTramite(nuevoEstado);
            tramiteRepo.save(t);
            resp.put("status", "OK");
            resp.put("mensaje", "Estado actualizado");
        } catch (Exception e) {
            log.error("Error actualizando estado de trámite", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    private List<Map<String, Object>> toList(List<Tramite> tramites) {
        List<Map<String, Object>> lista = new ArrayList<>();
        for (Tramite t : tramites) {
            Map<String, Object> item = new HashMap<>();
            item.put("idTramite", t.getIdTramite());
            item.put("idCita", t.getIdCita());
            item.put("estadoTramite", t.getEstadoTramite());
            item.put("valorOtroConceptos", t.getValorOtroConceptos());
            citaRepo.findById(t.getIdCita()).ifPresent(c -> {
                item.put("placaVehiculo", c.getPlacaVehiculo());
                item.put("tipoTramite", c.getTipoTramite());
                item.put("idCliente", c.getIdCliente());
                item.put("idAsesor", c.getIdAsesor());
                item.put("fechaCita", c.getFechaHoraProgramada());
            });
            lista.add(item);
        }
        return lista;
    }

    private Long toLong(Object val) {
        if (val == null) return null;
        if (val instanceof Number) return ((Number) val).longValue();
        return Long.parseLong(val.toString());
    }
}
