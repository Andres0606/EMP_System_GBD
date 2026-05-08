package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class VehiculoRequest {
    private String placa;
    private Long idCliente;  // Cédula del cliente
    private String marca;
    private String linea;
    private Integer modelo;
    private String clase;
    private String tipoServicio;
    private String numMotor;
    private String numChasis;
    private String combustible;

}