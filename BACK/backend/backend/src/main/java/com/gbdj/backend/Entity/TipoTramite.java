package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "TIPOTRAMITE")
public class TipoTramite {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen_tipotramite")
    @SequenceGenerator(name = "gen_tipotramite", sequenceName = "SEQ_TIPOTRAMITE", allocationSize = 1)
    @Column(name = "IDTIPOTRAMITE")
    private Long idTipoTramite;

    @Column(name = "NOMBRE")
    private String nombre;

    @Column(name = "DESCRIPCION")
    private String descripcion;

    @Column(name = "VALORBASE")
    private Double valorBase;

    @Column(name = "REQUIEREVECHICULO")
    private String requiereVehiculo;
}
