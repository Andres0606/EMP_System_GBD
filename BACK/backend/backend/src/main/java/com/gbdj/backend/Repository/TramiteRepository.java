package com.gbdj.backend.Repository;

import com.gbdj.backend.Entity.Tramite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TramiteRepository extends JpaRepository<Tramite, Long> {

    @Query("SELECT t FROM Tramite t JOIN Cita c ON t.idCita = c.idCita WHERE c.idAsesor = :idAsesor")
    List<Tramite> findByIdAsesor(@Param("idAsesor") Long idAsesor);

    @Query("SELECT t FROM Tramite t JOIN Cita c ON t.idCita = c.idCita WHERE c.idCliente = :idCliente")
    List<Tramite> findByIdCliente(@Param("idCliente") Long idCliente);

    java.util.Optional<Tramite> findByIdCita(Long idCita);

    @Query("SELECT COUNT(t) FROM Tramite t JOIN Cita c ON t.idCita = c.idCita WHERE c.idAsesor = :idAsesor AND c.idCliente = :idCliente")
    long countByAsesorAndCliente(@Param("idAsesor") Long idAsesor, @Param("idCliente") Long idCliente);
}
