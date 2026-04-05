package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class TipoTramiteDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double valorBase;
}