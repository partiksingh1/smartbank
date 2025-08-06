package com.smartbank.dto;

import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String countryCode;
    private String phoneNumber;
    private String address;
}
