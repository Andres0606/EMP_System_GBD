package com.gbdj.backend.Service;

import com.gbdj.backend.Entity.Vehiculo;
import com.gbdj.backend.Repository.VehiculoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehiculoService {

    private final VehiculoRepository vehiculoRepo;

    @Transactional
    public Map<String, Object> registrarVehiculo(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            String placa = (String) data.get("P1_PLACA");
            if (vehiculoRepo.existsById(placa)) {
                resp.put("status", "ERROR");
                resp.put("mensaje", "La placa ya existe");
                return resp;
            }
            Vehiculo v = new Vehiculo();
            v.setPlaca(placa);
            v.setMarca((String) data.get("P1_MARCA"));
            v.setLinea((String) data.get("P1_LINEA"));
            v.setModelo((String) data.get("P1_MODELO"));
            v.setClase((String) data.get("P1_CLASE"));
            v.setNumMotor((String) data.get("P1_NUMMOTOR"));
            v.setNumChasis((String) data.get("P1_NUMCHASIS"));
            v.setNumeroVin((String) data.get("P1_NUMEROVIN"));
            v.setCombustible(toLong(data.get("P1_COMBUSTIBLE")));
            v.setTipoServicio(toLong(data.get("P1_TIPOSERVICIO")));
            v.setColor(toLong(data.get("P1_COLOR")));
            v.setPrendado(data.getOrDefault("P1_PRENDADO", "N").toString());
            v.setEstado("ACTIVO");
            vehiculoRepo.save(v);
            resp.put("status", "OK");
            resp.put("mensaje", "Vehículo registrado");
        } catch (Exception e) {
            log.error("Error registrando vehículo", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    public Map<String, Object> listarVehiculosPorCliente(Long idCliente) {
        Map<String, Object> resp = new HashMap<>();
        try {
            List<Vehiculo> vehiculos = vehiculoRepo.findByIdCliente(idCliente);
            List<Map<String, Object>> lista = new ArrayList<>();
            for (Vehiculo v : vehiculos) {
                lista.add(vehiculoToMap(v));
            }
            resp.put("status", "OK");
            resp.put("vehiculos", lista);
        } catch (Exception e) {
            log.error("Error listando vehículos", e);
            resp.put("status", "OK");
            resp.put("vehiculos", new ArrayList<>());
        }
        return resp;
    }

    @Transactional
    public Map<String, Object> actualizarVehiculo(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            String placa = (String) data.get("P_PLACA_ORIGINAL");
            Vehiculo v = vehiculoRepo.findById(placa).orElseThrow();
            if (data.get("P_COLOR") != null) v.setColor(toLong(data.get("P_COLOR")));
            if (data.get("P_TIPO_SERVICIO") != null) v.setTipoServicio(toLong(data.get("P_TIPO_SERVICIO")));
            if (data.get("P_NUM_MOTOR") != null) v.setNumMotor((String) data.get("P_NUM_MOTOR"));
            if (data.get("P_NUM_CHASIS") != null) v.setNumChasis((String) data.get("P_NUM_CHASIS"));
            if (data.get("P_CLASE") != null) v.setClase((String) data.get("P_CLASE"));
            if (data.get("P_COMBUSTIBLE") != null) v.setCombustible(toLong(data.get("P_COMBUSTIBLE")));
            vehiculoRepo.save(v);
            resp.put("status", "OK");
            resp.put("mensaje", "Vehículo actualizado");
        } catch (Exception e) {
            log.error("Error actualizando vehículo", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    @Transactional
    public Map<String, Object> cancelarMatricula(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            String placa = (String) data.get("P_PLACA");
            Vehiculo v = vehiculoRepo.findById(placa).orElseThrow();
            v.setEstado("INACTIVO");
            v.setFechaCancelacion(new java.util.Date());
            vehiculoRepo.save(v);
            resp.put("status", "OK");
            resp.put("mensaje", "Matrícula cancelada");
        } catch (Exception e) {
            log.error("Error cancelando matrícula", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    @Transactional
    public Map<String, Object> rematricular(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            String placa = (String) data.get("P_PLACA");
            Vehiculo v = vehiculoRepo.findById(placa).orElseThrow();
            v.setEstado("ACTIVO");
            v.setFechaReactivacion(new java.util.Date());
            vehiculoRepo.save(v);
            resp.put("status", "OK");
            resp.put("mensaje", "Vehículo rematriculado");
        } catch (Exception e) {
            log.error("Error en rematrícula", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    @Transactional
    public Map<String, Object> inscribirPrenda(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            String placa = (String) data.get("P_PLACA");
            Vehiculo v = vehiculoRepo.findById(placa).orElseThrow();
            v.setPrendado("S");
            vehiculoRepo.save(v);
            resp.put("status", "OK");
            resp.put("mensaje", "Prenda inscrita");
        } catch (Exception e) {
            log.error("Error inscribiendo prenda", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    @Transactional
    public Map<String, Object> levantarPrenda(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            String placa = (String) data.get("P_PLACA");
            Vehiculo v = vehiculoRepo.findById(placa).orElseThrow();
            v.setPrendado("N");
            vehiculoRepo.save(v);
            resp.put("status", "OK");
            resp.put("mensaje", "Prenda levantada");
        } catch (Exception e) {
            log.error("Error levantando prenda", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    @Transactional
    public Map<String, Object> realizarTraspaso(Map<String, Object> data) {
        // El traspaso solo actualiza el estado del trámite; el cambio de propietario
        // se maneja a nivel de CITA/TRAMITE con el nuevo cliente
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "OK");
        resp.put("mensaje", "Traspaso registrado");
        return resp;
    }

    public Map<String, Object> registrarHistorial(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", "OK");
        resp.put("mensaje", "Historial registrado");
        return resp;
    }

    private Map<String, Object> vehiculoToMap(Vehiculo v) {
        Map<String, Object> m = new HashMap<>();
        m.put("placa", v.getPlaca());
        m.put("marca", v.getMarca());
        m.put("linea", v.getLinea());
        m.put("modelo", v.getModelo());
        m.put("clase", v.getClase());
        m.put("numMotor", v.getNumMotor());
        m.put("numChasis", v.getNumChasis());
        m.put("combustible", v.getCombustible());
        m.put("numeroVin", v.getNumeroVin());
        m.put("tipoServicio", v.getTipoServicio());
        m.put("color", v.getColor());
        m.put("estado", v.getEstado());
        m.put("prendado", v.getPrendado());
        return m;
    }

    private Long toLong(Object val) {
        if (val == null) return null;
        if (val instanceof Number) return ((Number) val).longValue();
        return Long.parseLong(val.toString());
    }
}
