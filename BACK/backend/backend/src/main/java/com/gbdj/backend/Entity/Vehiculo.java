package com.gbdj.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "VEHICULO")
public class Vehiculo {

    @Id
    @Column(name = "PLACA")
    private String placa;

    @Column(name = "MARCA")
    private String marca;

    @Column(name = "LINEA")
    private String linea;

    @Column(name = "MODELO")
    private String modelo;

    @Column(name = "CLASE")
    private String clase;

    @Column(name = "NUMMOTOR")
    private String numMotor;

    @Column(name = "NUMCHASIS")
    private String numChasis;

    @Column(name = "COMBUSTIBLE")
    private Long combustible;

    @Column(name = "NUMEROVIN")
    private String numeroVin;

    @Column(name = "TIPOSERVICIO")
    private Long tipoServicio;

    @Column(name = "COLOR")
    private Long color;

    @Column(name = "ESTADO")
    private String estado;

    @Column(name = "PRENDADO")
    private String prendado;

    @Column(name = "FECHA_REACTIVACION")
    @Temporal(TemporalType.DATE)
    private Date fechaReactivacion;

    @Column(name = "FECHA_CANCELACION")
    @Temporal(TemporalType.DATE)
    private Date fechaCancelacion;
}
