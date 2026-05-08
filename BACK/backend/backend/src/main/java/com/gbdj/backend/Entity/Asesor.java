package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ASESOR")
public class Asesor {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen_asesor")
    @SequenceGenerator(name = "gen_asesor", sequenceName = "SEQ_ASESOR", allocationSize = 1)
    @Column(name = "IDASESOR")
    private Long idAsesor;

    @Column(name = "NDOCUMENTO")
    private Long nDocumento;

    @Column(name = "ESPECIALIDADTRAMITE")
    private String especialidadTramite;

    @Column(name = "ESTADO")
    private String estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NDOCUMENTO", insertable = false, updatable = false)
    private Persona persona;
}
