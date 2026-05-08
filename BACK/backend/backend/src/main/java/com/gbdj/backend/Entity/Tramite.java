package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "TRAMITE")
public class Tramite {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen_tramite")
    @SequenceGenerator(name = "gen_tramite", sequenceName = "SEQ_TRAMITE", allocationSize = 1)
    @Column(name = "IDTRAMITE")
    private Long idTramite;

    @Column(name = "IDCITA")
    private Long idCita;

    @Column(name = "ESTADOTRAMITE")
    private String estadoTramite;

    @Column(name = "VALOTOTROCONCEPTOS")
    private Double valorOtroConceptos;
}
