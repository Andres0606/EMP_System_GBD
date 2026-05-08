package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "COLOR")
public class Color {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen_color")
    @SequenceGenerator(name = "gen_color", sequenceName = "SEQ_COLOR", allocationSize = 1)
    @Column(name = "IDCOLOR")
    private Long idColor;

    @Column(name = "NOMBRECOLOR")
    private String nombreColor;
}
