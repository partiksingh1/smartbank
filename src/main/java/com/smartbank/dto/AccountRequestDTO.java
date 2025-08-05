package com.smartbank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountRequestDTO {
    @NotBlank(message = "Account number is required")
    private String accountNumber;

    @NotBlank(message = "Account type is required")
    private String accountType;

    @NotNull(message = "Balance is required")
    private BigDecimal balance;

    private String branch;

    @NotBlank(message = "PIN is required")
    private String pin;

    @NotNull(message = "User ID is required")
    private Long userId;
}
