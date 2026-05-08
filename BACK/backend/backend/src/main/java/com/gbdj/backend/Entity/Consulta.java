package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "CONSULTA")
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen_consulta")
    @SequenceGenerator(name = "gen_consulta", sequenceName = "SEQ_CONSULTA", allocationSize = 1)
    @Column(name = "IDCONSULTA")
    private Long idConsulta;

    @Column(name = "IDCLIENTE")
    private Long idCliente;

    @Column(name = "ASUNTO")
    private String asunto;

    @Lob
    @Column(name = "MENSAJE")
    private String mensaje;

    @Column(name = "FECHACREACION")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaCreacion;

    @Column(name = "RESPUESTA")
    private String respuesta;

    @Column(name = "FECHA_RESPUESTA")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaRespuesta;

    @Column(name = "ESTADO")
    private String estado;
}
