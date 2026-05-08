package com.gbdj.backend.Repository;

import com.gbdj.backend.Entity.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface VehiculoRepository extends JpaRepository<Vehiculo, String> {

    @Query("SELECT DISTINCT v FROM Vehiculo v JOIN Cita c ON v.placa = c.placaVehiculo WHERE c.idCliente = :idCliente")
    List<Vehiculo> findByIdCliente(@Param("idCliente") Long idCliente);
}
