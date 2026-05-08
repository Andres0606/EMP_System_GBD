package com.gbdj.backend.Repository;

import com.gbdj.backend.Entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findBynDocumento(Long nDocumento);

    @Query("SELECT DISTINCT c FROM Cliente c JOIN Cita cita ON c.idCliente = cita.idCliente JOIN FETCH c.persona WHERE cita.idAsesor = :idAsesor")
    List<Cliente> findByIdAsesorWithPersona(@Param("idAsesor") Long idAsesor);
}
