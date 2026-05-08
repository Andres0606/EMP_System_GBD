package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "TIPOSERVICIO")
public class TipoServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen_tiposervicio")
    @SequenceGenerator(name = "gen_tiposervicio", sequenceName = "SEQ_TIPOSERVICIO", allocationSize = 1)
    @Column(name = "IDTIPOSERVICIO")
    private Long idTipoServicio;

    @Column(name = "NOMBRESERVICIO")
    private String nombreServicio;
}
