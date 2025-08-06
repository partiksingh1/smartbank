package com.smartbank.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private Long id;
    private String token;
    private String message;
}
