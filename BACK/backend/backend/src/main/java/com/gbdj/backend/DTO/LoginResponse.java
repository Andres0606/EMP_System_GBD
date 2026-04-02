package com.gbdj.backend.DTO;

import lombok.Data;

@Data
public class LoginResponse {
    private String status;
    private Long cedula;
    private Integer rol;
    private String mensaje;
}