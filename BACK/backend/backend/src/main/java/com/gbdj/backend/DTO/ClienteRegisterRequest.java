package com.gbdj.backend.DTO;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

@Data
public class ClienteRegisterRequest {
    // Datos de PERSONA
    private Long cedula;
    private String nombres;
    private String apellido;
    
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date fechaNacimiento;
    
    private Long telefono;
    private String correo;
    private String contrasena;
    
    // Datos de CLIENTE
    private String licenciaConduccion;  // Opcional
    private Integer tipoUsuario;         // Opcional, default 1
}