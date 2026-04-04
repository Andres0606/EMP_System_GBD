package com.gbdj.backend.DTO;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

@Data
public class ActualizarPerfilRequest {
    private Long cedula;
    private String nombres;
    private String apellido;
    
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date fechaNacimiento;
    
    private Long telefono;
    private String correo;
    private String contrasena;
    private String licenciaConduccion;
}