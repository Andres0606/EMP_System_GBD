package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class VehiculoResponse {
    private String placa;
    private String marca;
    private String linea;
    private Integer modelo;
    private String clase;
    private String tipoServicio;
    private String numMotor;
    private String numChasis;
    private String combustible;
}