package com.smartbank.dto;

import com.smartbank.entity.User;
import lombok.Data;

@Data
public class LoginResponseDTO {
    private User user;
    private String token;
    private String message;
}
