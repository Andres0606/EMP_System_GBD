package com.gbdj.backend.Service;

import com.gbdj.backend.Entity.Cliente;
import com.gbdj.backend.Entity.Persona;
import com.gbdj.backend.Repository.AsesorRepository;
import com.gbdj.backend.Repository.ClienteRepository;
import com.gbdj.backend.Repository.TramiteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClienteService {

    private final AsesorRepository asesorRepo;
    private final ClienteRepository clienteRepo;
    private final TramiteRepository tramiteRepo;

    public Map<String, Object> listarClientesPorAsesor(Long cedulaAsesor) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Long idAsesor = asesorRepo.findByNDocumento(cedulaAsesor)
                    .map(a -> a.getIdAsesor()).orElse(null);
            if (idAsesor == null) {
                resp.put("status", "ERROR");
                resp.put("mensaje", "Asesor no encontrado");
                return resp;
            }

            List<Cliente> clientes = clienteRepo.findByIdAsesorWithPersona(idAsesor);
            List<Map<String, Object>> lista = new ArrayList<>();
            for (Cliente c : clientes) {
                Map<String, Object> item = new HashMap<>();
                item.put("idCliente", c.getIdCliente());
                item.put("cedula", c.getNDocumento());
                Persona p = c.getPersona();
                if (p != null) {
                    item.put("nombres", p.getNombres());
                    item.put("apellido", p.getApellidos());
                    item.put("telefono", p.getTelefono());
                    item.put("correo", p.getCorreo());
                }
                long totalTramites = tramiteRepo.countByAsesorAndCliente(idAsesor, c.getIdCliente());
                item.put("totalTramites", totalTramites);
                lista.add(item);
            }

            resp.put("status", "OK");
            resp.put("clientes", lista);
        } catch (Exception e) {
            log.error("Error listando clientes por asesor", e);
            resp.put("status", "ERROR");
            resp.put("mensaje", e.getMessage());
        }
        return resp;
    }
}
