package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class TramiteDTO {
    private Long idTramite;
    private Long idCita;
    private String cliente;
    private String telefono;
    private String correo;
    private String vehiculo;
    private String tipoTramite;
    private Double valorTramite;
    private Double valorOtrosConceptos;
    private String estadoTramite;
    private String fechaCreacion;
    private String fechaCita;
}