package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class SolicitarCitaRequest {
    private Long idCliente;      // IDCLIENTE
    private String idVehiculo;   // IDVEHICULO
    private Long idTipoTramite;  // TIPOTRAMITE
}