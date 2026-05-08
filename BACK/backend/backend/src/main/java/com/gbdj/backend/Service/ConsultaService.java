package com.gbdj.backend.Service;

import com.gbdj.backend.Entity.Consulta;
import com.gbdj.backend.Repository.ConsultaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConsultaService {

    private final ConsultaRepository consultaRepo;

    @Transactional
    public Map<String, Object> crearConsulta(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Consulta c = new Consulta();
            c.setIdCliente(toLong(data.get("P_ID_CLIENTE")));
            c.setAsunto((String) data.get("P_ASUNTO"));
            c.setMensaje((String) data.get("P_MENSAJE"));
            c.setFechaCreacion(new Date());
            c.setEstado("PENDIENTE");
            consultaRepo.save(c);
            resp.put("status", "OK");
            resp.put("mensaje", "Consulta creada");
            resp.put("idConsulta", c.getIdConsulta());
        } catch (Exception e) {
            log.error("Error creando consulta", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    public Map<String, Object> listarConsultasPorCliente(Long idCliente) {
        Map<String, Object> resp = new HashMap<>();
        try {
            List<Consulta> lista = consultaRepo.findByIdCliente(idCliente);
            resp.put("status", "OK");
            resp.put("consultas", toList(lista));
        } catch (Exception e) {
            log.error("Error listando consultas", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    public Map<String, Object> listarTodasConsultas() {
        Map<String, Object> resp = new HashMap<>();
        try {
            List<Consulta> lista = consultaRepo.findAll();
            resp.put("status", "OK");
            resp.put("consultas", toList(lista));
        } catch (Exception e) {
            log.error("Error listando consultas", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    @Transactional
    public Map<String, Object> responderConsulta(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Long idConsulta = toLong(data.get("P_ID_CONSULTA"));
            Consulta c = consultaRepo.findById(idConsulta).orElseThrow();
            c.setRespuesta((String) data.get("P_RESPUESTA"));
            c.setFechaRespuesta(new Date());
            c.setEstado("RESPONDIDA");
            consultaRepo.save(c);
            resp.put("status", "OK");
            resp.put("mensaje", "Consulta respondida");
        } catch (Exception e) {
            log.error("Error respondiendo consulta", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    private List<Map<String, Object>> toList(List<Consulta> consultas) {
        List<Map<String, Object>> lista = new ArrayList<>();
        for (Consulta c : consultas) {
            Map<String, Object> item = new HashMap<>();
            item.put("idConsulta", c.getIdConsulta());
            item.put("idCliente", c.getIdCliente());
            item.put("asunto", c.getAsunto());
            item.put("mensaje", c.getMensaje());
            item.put("fechaCreacion", c.getFechaCreacion());
            item.put("respuesta", c.getRespuesta());
            item.put("fechaRespuesta", c.getFechaRespuesta());
            item.put("estado", c.getEstado());
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
