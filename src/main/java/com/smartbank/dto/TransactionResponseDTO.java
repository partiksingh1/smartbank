package com.smartbank.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionResponseDTO {
    private Long id;
    private BigDecimal amount;
    private LocalDateTime transactionDate;
    private String transactionType;
    private String transactionStatus;
}
