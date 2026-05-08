package com.gbdj.backend.Repository;

import com.gbdj.backend.Entity.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    List<Consulta> findByIdCliente(Long idCliente);
}
