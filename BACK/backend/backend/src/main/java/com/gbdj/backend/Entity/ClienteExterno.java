package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "CLIENTEEXTERNO")
public class ClienteExterno {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gen_clienteexterno")
    @SequenceGenerator(name = "gen_clienteexterno", sequenceName = "SEQ_CLIENTEEXTERNO", allocationSize = 1)
    @Column(name = "IDEXTERNO")
    private Long idExterno;

    @Column(name = "CEDULA")
    private String cedula;

    @Column(name = "NOMBRES")
    private String nombres;

    @Column(name = "APELLIDO")
    private String apellido;
}
