package com.gbdj.backend.Service;

import com.gbdj.backend.Entity.*;
import com.gbdj.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final PersonaRepository personaRepo;
    private final AsesorRepository asesorRepo;
    private final ClienteRepository clienteRepo;
    private final AdminRepository adminRepo;

    // ROL: 1=Admin, 2=Asesor, 3=Cliente
    public Map<String, Object> validarLogin(String correo, String contrasena) {
        Map<String, Object> resp = new HashMap<>();
        Optional<Persona> opt = personaRepo.findByCorreoAndContrasena(correo, contrasena);
        if (opt.isEmpty()) {
            resp.put("status", "ERROR");
            resp.put("mensaje", "Credenciales inválidas");
            return resp;
        }
        Persona p = opt.get();
        int rol = determinarRol(p.getNDocumento());
        if (rol == 0) {
            resp.put("status", "ERROR");
            resp.put("mensaje", "Usuario no tiene rol asignado");
            return resp;
        }
        resp.put("status", "OK");
        resp.put("cedula", p.getNDocumento());
        resp.put("nombres", p.getNombres());
        resp.put("apellido", p.getApellidos());
        resp.put("correo", p.getCorreo());
        resp.put("rol", rol);
        if (rol == 2) {
            asesorRepo.findByNDocumento(p.getNDocumento())
                .ifPresent(a -> resp.put("idAsesor", a.getIdAsesor()));
        } else if (rol == 3) {
            clienteRepo.findByNDocumento(p.getNDocumento())
                .ifPresent(c -> resp.put("idCliente", c.getIdCliente()));
        }
        return resp;
    }

    private int determinarRol(Long nDocumento) {
        if (adminRepo.existsById(nDocumento)) return 1;
        if (asesorRepo.findByNDocumento(nDocumento).isPresent()) return 2;
        if (clienteRepo.findByNDocumento(nDocumento).isPresent()) return 3;
        return 0;
    }

    @Transactional
    public Map<String, Object> registrarAsesor(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Persona p = new Persona();
            p.setNDocumento(toLong(data.get("cedula")));
            p.setTipoDocumento("CC");
            p.setNombres((String) data.get("nombres"));
            p.setApellidos((String) data.get("apellido"));
            p.setCorreo((String) data.get("correo"));
            p.setContrasena((String) data.get("contrasena"));
            p.setTelefono(toLong(data.get("telefono")));
            p.setFechaRegistro(new Date());
            if (data.get("fechaNacimiento") != null) {
                p.setFechaNacimiento(parseDate(data.get("fechaNacimiento").toString()));
            }
            personaRepo.save(p);

            Asesor a = new Asesor();
            a.setNDocumento(p.getNDocumento());
            a.setEspecialidadTramite((String) data.get("especialidadTramite"));
            a.setEstado("Activo");
            asesorRepo.save(a);

            resp.put("status", "OK");
            resp.put("mensaje", "Asesor registrado exitosamente");
        } catch (Exception e) {
            log.error("Error registrando asesor", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    @Transactional
    public Map<String, Object> registrarCliente(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Persona p = new Persona();
            p.setNDocumento(toLong(data.get("P_NUMERODOCUMENTO")));
            p.setTipoDocumento((String) data.get("P_TIPODOCUMENTO"));
            p.setNombres((String) data.get("P_NOMBRES"));
            p.setApellidos((String) data.get("P_APELLIDO"));
            p.setCorreo((String) data.get("P_CORREO"));
            p.setContrasena((String) data.get("P_CONTRASENA"));
            p.setFechaRegistro(new Date());
            if (data.get("P_FECHANACIMIENTO") != null) {
                p.setFechaNacimiento(parseDate(data.get("P_FECHANACIMIENTO").toString()));
            }
            if (data.get("P_TELEFONO") != null) {
                p.setTelefono(toLong(data.get("P_TELEFONO")));
            }
            personaRepo.save(p);

            Cliente c = new Cliente();
            c.setNDocumento(p.getNDocumento());
            c.setLicenciaConduccion(data.getOrDefault("P_LICENCIACONDUCCION", "N").toString());
            clienteRepo.save(c);

            resp.put("status", "OK");
            resp.put("mensaje", "Cliente registrado exitosamente");
        } catch (Exception e) {
            log.error("Error registrando cliente", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    public Map<String, Object> obtenerPersonaPorCedula(Long cedula) {
        Map<String, Object> resp = new HashMap<>();
        Optional<Persona> opt = personaRepo.findById(cedula);
        if (opt.isEmpty()) {
            resp.put("status", "ERROR");
            resp.put("mensaje", "Persona no encontrada");
            return resp;
        }
        Persona p = opt.get();
        resp.put("status", "OK");
        resp.put("cedula", p.getNDocumento());
        resp.put("nombres", p.getNombres());
        resp.put("apellido", p.getApellidos());
        resp.put("correo", p.getCorreo());
        resp.put("telefono", p.getTelefono());
        resp.put("fechaNacimiento", p.getFechaNacimiento());
        resp.put("licenciaConduccion", clienteRepo.findByNDocumento(cedula)
            .map(Cliente::getLicenciaConduccion).orElse(null));
        resp.put("rol", determinarRol(cedula));
        return resp;
    }

    @Transactional
    public Map<String, Object> actualizarPerfil(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Long cedula = toLong(data.get("P_CEDULA"));
            Persona p = personaRepo.findById(cedula).orElseThrow();
            if (data.get("P_NOMBRES") != null) p.setNombres((String) data.get("P_NOMBRES"));
            if (data.get("P_APELLIDO") != null) p.setApellidos((String) data.get("P_APELLIDO"));
            if (data.get("P_CORREO") != null) p.setCorreo((String) data.get("P_CORREO"));
            if (data.get("P_CONTRASENA") != null && !data.get("P_CONTRASENA").toString().isBlank()) {
                p.setContrasena((String) data.get("P_CONTRASENA"));
            }
            if (data.get("P_TELEFONO") != null) p.setTelefono(toLong(data.get("P_TELEFONO")));
            personaRepo.save(p);
            clienteRepo.findByNDocumento(cedula).ifPresent(c -> {
                if (data.get("P_LICENCIACONDUCCION") != null) {
                    c.setLicenciaConduccion((String) data.get("P_LICENCIACONDUCCION"));
                    clienteRepo.save(c);
                }
            });
            resp.put("status", "OK");
            resp.put("mensaje", "Perfil actualizado");
        } catch (Exception e) {
            log.error("Error actualizando perfil", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    public Map<String, Object> listarAsesores() {
        Map<String, Object> resp = new HashMap<>();
        try {
            List<Map<String, Object>> lista = new ArrayList<>();
            asesorRepo.findAllActivos().forEach(a -> {
                Map<String, Object> item = new HashMap<>();
                item.put("idAsesor", a.getIdAsesor());
                item.put("cedula", a.getNDocumento());
                item.put("especialidad", a.getEspecialidadTramite());
                item.put("estado", a.getEstado());
                if (a.getPersona() != null) {
                    item.put("nombres", a.getPersona().getNombres());
                    item.put("apellido", a.getPersona().getApellidos());
                    item.put("correo", a.getPersona().getCorreo());
                    item.put("telefono", a.getPersona().getTelefono());
                }
                lista.add(item);
            });
            resp.put("status", "OK");
            resp.put("asesores", lista);
        } catch (Exception e) {
            log.error("Error listando asesores", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    public Map<String, Object> obtenerAsesorPorCedula(Long cedula) {
        Map<String, Object> resp = new HashMap<>();
        Optional<Asesor> opt = asesorRepo.findByNDocumentoWithPersona(cedula);
        if (opt.isEmpty()) {
            resp.put("status", "ERROR");
            resp.put("mensaje", "Asesor no encontrado");
            return resp;
        }
        Asesor a = opt.get();
        resp.put("status", "OK");
        resp.put("idAsesor", a.getIdAsesor());
        resp.put("cedula", a.getNDocumento());
        resp.put("especialidad", a.getEspecialidadTramite());
        resp.put("estado", a.getEstado());
        if (a.getPersona() != null) {
            resp.put("nombres", a.getPersona().getNombres());
            resp.put("apellido", a.getPersona().getApellidos());
            resp.put("correo", a.getPersona().getCorreo());
            resp.put("telefono", a.getPersona().getTelefono());
        }
        return resp;
    }

    @Transactional
    public Map<String, Object> actualizarAsesor(Map<String, Object> data) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Long cedula = toLong(data.get("P_CEDULA"));
            Persona p = personaRepo.findById(cedula).orElseThrow();
            if (data.get("P_NOMBRES") != null) p.setNombres((String) data.get("P_NOMBRES"));
            if (data.get("P_APELLIDO") != null) p.setApellidos((String) data.get("P_APELLIDO"));
            if (data.get("P_CORREO") != null) p.setCorreo((String) data.get("P_CORREO"));
            if (data.get("P_TELEFONO") != null) p.setTelefono(toLong(data.get("P_TELEFONO")));
            personaRepo.save(p);
            asesorRepo.findByNDocumento(cedula).ifPresent(a -> {
                if (data.get("P_ESPECIALIDAD") != null) a.setEspecialidadTramite((String) data.get("P_ESPECIALIDAD"));
                asesorRepo.save(a);
            });
            resp.put("status", "OK");
            resp.put("mensaje", "Asesor actualizado");
        } catch (Exception e) {
            log.error("Error actualizando asesor", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    @Transactional
    public Map<String, Object> eliminarAsesor(Long cedula) {
        Map<String, Object> resp = new HashMap<>();
        try {
            asesorRepo.findByNDocumento(cedula).ifPresent(a -> {
                a.setEstado("Inactivo");
                asesorRepo.save(a);
            });
            resp.put("status", "OK");
            resp.put("mensaje", "Asesor desactivado");
        } catch (Exception e) {
            log.error("Error eliminando asesor", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }

    private Long toLong(Object val) {
        if (val == null) return null;
        if (val instanceof Number) return ((Number) val).longValue();
        return Long.parseLong(val.toString());
    }

    private Date parseDate(String fecha) {
        String[] formats = {"dd/MM/yyyy", "yyyy-MM-dd"};
        for (String fmt : formats) {
            try { return new SimpleDateFormat(fmt).parse(fecha); } catch (ParseException ignored) {}
        }
        return null;
    }
}
