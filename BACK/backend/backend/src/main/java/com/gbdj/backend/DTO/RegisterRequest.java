package com.gbdj.backend.DTO;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

@Data
public class RegisterRequest {
    private Long cedula;
    private String nombres;
    private String apellido;
    
    @JsonFormat(pattern = "dd/MM/yyyy")  // Cambiado a formato día/mes/año
    private Date fechaNacimiento;
    
    private Long telefono;
    private String correo;
    private String contrasena;
}