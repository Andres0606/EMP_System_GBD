package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "COMBUSTIBLE")
public class Combustible {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen_combustible")
    @SequenceGenerator(name = "gen_combustible", sequenceName = "SEQ_COMBUSTIBLE", allocationSize = 1)
    @Column(name = "IDCOMBUSTIBLE")
    private Long idCombustible;

    @Column(name = "NOMBRECOMBUSTIBLE")
    private String nombreCombustible;
}
