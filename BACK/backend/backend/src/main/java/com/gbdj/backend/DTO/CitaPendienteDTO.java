package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class CitaPendienteDTO {
    private Long idCita;
    private String cliente;
    private String telefono;
    private String correo;
    private String vehiculo;
    private String tipoTramite;
    private Double valorBase;
    private String fechaSolicitud;
    private Integer esSuEspecialidad; // 1 = sí, 0 = no
}