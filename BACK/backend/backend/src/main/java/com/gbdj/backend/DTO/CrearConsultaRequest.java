package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class CrearConsultaRequest {
    private Long idCliente;
    private String asunto;
    private String mensaje;
}