package com.gbdj.backend.Repository;

import com.gbdj.backend.Entity.Asesor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface AsesorRepository extends JpaRepository<Asesor, Long> {
    Optional<Asesor> findByNDocumento(Long nDocumento);

    @Query("SELECT a FROM Asesor a JOIN FETCH a.persona WHERE a.estado = 'Activo'")
    List<Asesor> findAllActivos();

    @Query("SELECT a FROM Asesor a JOIN FETCH a.persona WHERE a.nDocumento = :cedula")
    Optional<Asesor> findByNDocumentoWithPersona(@Param("cedula") Long cedula);
}
