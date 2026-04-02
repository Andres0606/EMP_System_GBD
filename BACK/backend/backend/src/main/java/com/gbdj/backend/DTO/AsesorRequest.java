package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class AsesorRequest {
    // Datos de PERSONA
    private Long cedula;
    private String nombres;
    private String apellido;
    private String fechaNacimiento;  // Formato DD/MM/YYYY
    private Long telefono;
    private String correo;
    private String contrasena;
    
    // Datos de ASESOR
    private String especialidadTramite;
    private Double sueldo;
}