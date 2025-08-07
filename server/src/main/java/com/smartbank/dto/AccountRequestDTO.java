package com.smartbank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountRequestDTO {

    @NotBlank(message = "Account type is required")
    private String accountType;

    private BigDecimal balance = BigDecimal.ZERO;

    private String branch;

    @NotBlank(message = "PIN is required")
    private String pin;
}
