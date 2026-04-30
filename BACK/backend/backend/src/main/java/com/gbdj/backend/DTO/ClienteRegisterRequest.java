package com.gbdj.backend.DTO;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

@Data
public class ClienteRegisterRequest {
    private String tipoDocumento;      // CEDULA, NIT, PASAPORTE, TARJETA_IDENTIDAD
    private Long numeroDocumento;      // El número de identificación
    private String nombres;
    private String apellido;
    
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date fechaNacimiento;
    
    private Long telefono;
    private String correo;
    private String contrasena;
    private String licenciaConduccion;  // 'S' o 'N'
    private Integer tipoUsuario;         // default 1
}