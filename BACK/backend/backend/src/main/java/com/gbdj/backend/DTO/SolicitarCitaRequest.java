package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class SolicitarCitaRequest {
    private Long idCliente;           // IDCLIENTE
    private String idVehiculo;        // IDVEHICULO
    private Long idTipoTramite;       // TIPOTRAMITE
    
    // 👇 Nuevos campos para traspaso
    private String esDuenioRegistrado;   // 'S' o 'N'
    private Long cedulaDuenioActual;     // Cédula del dueño actual (si no es él)
    private String nombreDuenioActual;   // Nombre del dueño actual
    private String apellidoDuenioActual; // Apellido del dueño actual
}