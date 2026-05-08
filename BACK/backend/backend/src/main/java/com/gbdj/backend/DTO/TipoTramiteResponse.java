package com.gbdj.backend.DTO;

import lombok.Data;
import java.util.List;

@Data
public class TipoTramiteResponse {
    private String status;
    private List<TipoTramiteDTO> tiposTramite;
    private String mensaje;
}