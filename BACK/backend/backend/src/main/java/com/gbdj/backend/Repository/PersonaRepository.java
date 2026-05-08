package com.gbdj.backend.Repository;

import com.gbdj.backend.Entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PersonaRepository extends JpaRepository<Persona, Long> {
    Optional<Persona> findByCorreoAndContrasena(String correo, String contrasena);
    Optional<Persona> findByCorreo(String correo);
}
