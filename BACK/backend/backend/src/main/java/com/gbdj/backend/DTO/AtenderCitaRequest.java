package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class AtenderCitaRequest {
    private Long idCita;
    private Long idAsesor;
    private String fechaProgramada;
}