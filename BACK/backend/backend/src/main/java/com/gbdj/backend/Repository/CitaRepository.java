package com.gbdj.backend.Repository;

import com.gbdj.backend.Entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Long> {
    List<Cita> findByIdAsesorAndEstadoCita(Long idAsesor, String estadoCita);
    List<Cita> findByIdAsesor(Long idAsesor);
    List<Cita> findByIdCliente(Long idCliente);
}
