package com.smartbank.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountResponseDTO {
    private Long id;
    private String accountNumber;
    private String accountType;
    private BigDecimal balance;
    private String branch;
    private Long userId;
}
