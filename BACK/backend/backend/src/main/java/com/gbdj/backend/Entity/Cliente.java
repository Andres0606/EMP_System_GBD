package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "CLIENTE")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen_cliente")
    @SequenceGenerator(name = "gen_cliente", sequenceName = "SEQ_CLIENTE", allocationSize = 1)
    @Column(name = "IDCLIENTE")
    private Long idCliente;

    @Column(name = "NDOCUMENTO")
    private Long nDocumento;

    @Column(name = "LICENCIACONDUCCION")
    private String licenciaConduccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NDOCUMENTO", insertable = false, updatable = false)
    private Persona persona;
}
