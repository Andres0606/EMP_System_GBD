package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ADMIN")
public class Admin {

    @Id
    @Column(name = "NDOCUMENTO")
    private Long nDocumento;

    @Column(name = "SUELDO")
    private Double sueldo;

    @OneToOne
    @JoinColumn(name = "NDOCUMENTO", insertable = false, updatable = false)
    private Persona persona;
}
