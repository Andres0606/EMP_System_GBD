package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class CrearTramiteRequest {
    private Long idCita;
    private Double valorTramite;
    private Double valorOtrosConceptos;  // 👈 este campo debe existir
}