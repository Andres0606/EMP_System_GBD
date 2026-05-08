package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class ActualizarEstadoRequest {
    private Long idTramite;
    private String estado;
}