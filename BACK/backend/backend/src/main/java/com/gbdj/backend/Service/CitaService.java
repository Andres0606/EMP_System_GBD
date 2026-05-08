package com.gbdj.backend.Service;

import com.gbdj.backend.Entity.Asesor;
import com.gbdj.backend.Entity.Cita;
import com.gbdj.backend.Entity.Cliente;
import com.gbdj.backend.Entity.ClienteExterno;
import com.gbdj.backend.Entity.Persona;
import com.gbdj.backend.Entity.TipoTramite;
import com.gbdj.backend.Repository.AsesorRepository;
import com.gbdj.backend.Repository.CitaRepository;
import com.gbdj.backend.Repository.ClienteRepository;
import com.gbdj.backend.Repository.ClienteExternoRepository;
import com.gbdj.backend.Repository.TipoTramiteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepo;
    private final ClienteRepository clienteRepo;
    private final AsesorRepository asesorRepo;
    private final TipoTramiteRepository tipoTramiteRepo;
    private final ClienteExternoRepository clienteExternoRepo;

    @Transactional
    public Map<String, Object> solicitarCita(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Long idTipoTramite = toLong(data.get("P_TIPO_TRAMITE"));
            Long idAsesor = toLong(data.get("P_ID_ASESOR"));
            if (idAsesor == null) {
                idAsesor = resolverAsesorId(idTipoTramite);
            }
            if (idAsesor == null) {
                resp.put("status", "ERROR");
                resp.put("mensaje", "No hay asesor disponible para este trámite");
                return resp;
            }

            String placaVehiculo = (String) data.get("P_PLACA_VEHICULO");
            if (placaVehiculo == null && data.get("P_ID_VEHICULO") != null) {
                placaVehiculo = data.get("P_ID_VEHICULO").toString();
            }

            String esElDueno = data.getOrDefault("P_ES_DUENIO_REGISTRADO",
                    data.getOrDefault("P_ES_EL_DUENO", "S")).toString();

            Long idClienteExterno = null;
            if ("N".equalsIgnoreCase(esElDueno)) {
                ClienteExterno externo = new ClienteExterno();
                externo.setCedula(toString(data.get("P_CEDULA_DUENIO_ACTUAL")));
                externo.setNombres(toString(data.get("P_NOMBRE_DUENIO_ACTUAL")));
                externo.setApellido(toString(data.get("P_APELLIDO_DUENIO_ACTUAL")));
                externo = clienteExternoRepo.save(externo);
                idClienteExterno = externo.getIdExterno();
            }

            Cita c = new Cita();
            c.setIdCliente(toLong(data.get("P_ID_CLIENTE")));
            c.setIdAsesor(idAsesor);
            c.setPlacaVehiculo(placaVehiculo);
            c.setTipoTramite(idTipoTramite);
            c.setEstadoCita("Agendada");
            c.setFechaHoraSolicitud(new Date());
            c.setEsElDueno(esElDueno);
            c.setIdClienteExterno(idClienteExterno);
            if (data.get("P_FECHA_PROGRAMADA") != null) {
                c.setFechaHoraProgramada(parseTimestamp(data.get("P_FECHA_PROGRAMADA").toString()));
            }
            citaRepo.save(c);
            resp.put("status", "OK");
            resp.put("mensaje", "Cita agendada exitosamente");
            resp.put("idCita", c.getIdCita());
        } catch (Exception e) {
            log.error("Error solicitando cita", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    public Map<String, Object> listarCitasPendientes(Long cedulaAsesor) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Optional<Asesor> asesorOpt = asesorRepo.findByNDocumento(cedulaAsesor);
            if (asesorOpt.isEmpty()) {
                resp.put("status", "ERROR");
                resp.put("mensaje", "Asesor no encontrado");
                return resp;
            }
            Long idAsesor = asesorOpt.get().getIdAsesor();
            List<Cita> citas = citaRepo.findByIdAsesorAndEstadoCita(idAsesor, "Agendada");
            resp.put("status", "OK");
            resp.put("citas", citasToList(citas, asesorOpt.get().getEspecialidadTramite()));
        } catch (Exception e) {
            log.error("Error listando citas pendientes", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    public Map<String, Object> listarCitasAgendadas(Long cedulaAsesor) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Optional<Asesor> asesorOpt = asesorRepo.findByNDocumento(cedulaAsesor);
            if (asesorOpt.isEmpty()) {
                resp.put("status", "ERROR");
                resp.put("mensaje", "Asesor no encontrado");
                return resp;
            }
            Long idAsesor = asesorOpt.get().getIdAsesor();
            List<Cita> citas = citaRepo.findByIdAsesor(idAsesor);
            resp.put("status", "OK");
            resp.put("citas", citasToList(citas, asesorOpt.get().getEspecialidadTramite()));
        } catch (Exception e) {
            log.error("Error listando citas agendadas", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    @Transactional
    public Map<String, Object> atenderCita(Map<String, Object> data) {
        return cambiarEstadoCita(toLong(data.get("P_ID_CITA")), "Atendida");
    }

    @Transactional
    public Map<String, Object> completarCita(Map<String, Object> data) {
        return cambiarEstadoCita(toLong(data.get("P_ID_CITA")), "Atendida");
    }

    @Transactional
    public Map<String, Object> cancelarCita(Map<String, Object> data) {
        return cambiarEstadoCita(toLong(data.get("P_ID_CITA")), "Cancelada");
    }

    private Map<String, Object> cambiarEstadoCita(Long idCita, String nuevoEstado) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Cita c = citaRepo.findById(idCita).orElseThrow();
            c.setEstadoCita(nuevoEstado);
            citaRepo.save(c);
            resp.put("status", "OK");
            resp.put("mensaje", "Cita actualizada");
        } catch (Exception e) {
            log.error("Error actualizando cita", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    private List<Map<String, Object>> citasToList(List<Cita> citas, String especialidadAsesor) {
        List<Map<String, Object>> lista = new ArrayList<>();
        for (Cita c : citas) {
            Cliente cliente = null;
            Persona persona = null;
            if (c.getIdCliente() != null) {
                cliente = clienteRepo.findById(c.getIdCliente()).orElse(null);
                if (cliente != null) {
                    persona = cliente.getPersona();
                }
            }
            TipoTramite tipo = null;
            if (c.getTipoTramite() != null) {
                tipo = tipoTramiteRepo.findById(c.getTipoTramite()).orElse(null);
            }

            Map<String, Object> item = new HashMap<>();
            item.put("idCita", c.getIdCita());
            item.put("idCliente", c.getIdCliente());
            item.put("idAsesor", c.getIdAsesor());
            item.put("cedulaCliente", cliente != null ? cliente.getNDocumento() : null);
            if (persona != null) {
                item.put("cliente", (persona.getNombres() + " " + persona.getApellidos()).trim());
                item.put("telefono", persona.getTelefono());
                item.put("correo", persona.getCorreo());
            }
            item.put("vehiculo", c.getPlacaVehiculo());
            item.put("placaVehiculo", c.getPlacaVehiculo());
            item.put("tipoTramite", tipo != null ? tipo.getNombre() : c.getTipoTramite());
            item.put("idTipoTramite", c.getTipoTramite());
            item.put("valorBase", tipo != null ? tipo.getValorBase() : null);
            item.put("estadoCita", c.getEstadoCita());
            item.put("fechaProgramada", c.getFechaHoraProgramada());
            item.put("fechaHoraProgramada", c.getFechaHoraProgramada());
            item.put("fechaSolicitud", c.getFechaHoraSolicitud());
            item.put("fechaHoraSolicitud", c.getFechaHoraSolicitud());
            item.put("esElDueno", c.getEsElDueno());
            item.put("esSuEspecialidad",
                    matchesEspecialidad(especialidadAsesor, tipo != null ? tipo.getNombre() : null) ? 1 : 0);
            lista.add(item);
        }
        return lista;
    }

    private Long resolverAsesorId(Long idTipoTramite) {
        List<Asesor> asesores = asesorRepo.findAllActivos();
        if (asesores.isEmpty())
            return null;

        String nombreTramite = null;
        if (idTipoTramite != null) {
            nombreTramite = tipoTramiteRepo.findById(idTipoTramite)
                    .map(TipoTramite::getNombre).orElse(null);
        }

        if (nombreTramite != null) {
            for (Asesor asesor : asesores) {
                if (matchesEspecialidad(asesor.getEspecialidadTramite(), nombreTramite)) {
                    return asesor.getIdAsesor();
                }
            }
        }

        return asesores.get(0).getIdAsesor();
    }

    private boolean matchesEspecialidad(String especialidad, String tipoTramiteNombre) {
        String esp = normalize(especialidad);
        String tipo = normalize(tipoTramiteNombre);
        if (esp.isEmpty() || tipo.isEmpty())
            return false;
        return tipo.contains(esp);
    }

    private String normalize(String val) {
        if (val == null)
            return "";
        String lowered = val.toLowerCase(Locale.ROOT).trim();
        String normalized = Normalizer.normalize(lowered, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return normalized.replaceAll("\\s+", " ");
    }

    private String toString(Object val) {
        return val == null ? null : val.toString();
    }

    private Long toLong(Object val) {
        if (val == null)
            return null;
        if (val instanceof Number)
            return ((Number) val).longValue();
        return Long.parseLong(val.toString());
    }

    private Date parseTimestamp(String val) {
        String[] formats = { "yyyy-MM-dd'T'HH:mm:ss", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd" };
        for (String fmt : formats) {
            try {
                return new SimpleDateFormat(fmt).parse(val);
            } catch (ParseException ignored) {
            }
        }
        return null;
    }
}
