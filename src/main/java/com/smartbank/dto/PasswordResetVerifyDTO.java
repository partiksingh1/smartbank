package com.smartbank.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordResetVerifyDTO {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String otp;

    @NotBlank
    private String newPassword;
}
