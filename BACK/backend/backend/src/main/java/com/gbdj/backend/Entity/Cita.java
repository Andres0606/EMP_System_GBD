package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "CITA")
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen_cita")
    @SequenceGenerator(name = "gen_cita", sequenceName = "SEQ_CITA", allocationSize = 1)
    @Column(name = "IDCITA")
    private Long idCita;

    @Column(name = "IDCLIENTE")
    private Long idCliente;

    @Column(name = "IDASESOR")
    private Long idAsesor;

    @Column(name = "PLACAVEHICULO")
    private String placaVehiculo;

    @Column(name = "TIPOTRAMITE")
    private Long tipoTramite;

    @Column(name = "ESTADOCITA")
    private String estadoCita;

    @Column(name = "FECHAHORAPROGRAMADA")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaHoraProgramada;

    @Column(name = "FECHAHORASOLICITUD")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaHoraSolicitud;

    @Column(name = "ESELDUENO")
    private String esElDueno;

    @Column(name = "IDCLIENTEEXTERNO")
    private Long idClienteExterno;
}
