package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "PERSONA")
public class Persona {

    @Id
    @Column(name = "NDOCUMENTO")
    private Long nDocumento;

    @Column(name = "TIPODOCUMENTO")
    private String tipoDocumento;

    @Column(name = "NOMBRES")
    private String nombres;

    @Column(name = "APELLIDOS")
    private String apellidos;

    @Column(name = "CORREO")
    private String correo;

    @Column(name = "CONTRASENA")
    private String contrasena;

    @Column(name = "FECHANACIMIENTO")
    @Temporal(TemporalType.DATE)
    private Date fechaNacimiento;

    @Column(name = "FECHAREGISTRO")
    @Temporal(TemporalType.DATE)
    private Date fechaRegistro;

    @Column(name = "TELEFONO")
    private Long telefono;
}
