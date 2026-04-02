package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class PersonaDTO {
    private String status;
    private Long cedula;
    private String nombres;
    private String apellido;
    private String correo;
    private Integer rol;
    private String mensaje;
}