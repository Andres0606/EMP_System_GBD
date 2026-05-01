package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class ActualizarPerfilRequest {
    private Long numeroDocumento;
    private String nombres;
    private String apellido;
    private String fechaNacimiento;  // 👈 Cambiar de Date a String
    private Long telefono;
    private String correo;
    private String contrasena;
    private String licenciaConduccion;
}