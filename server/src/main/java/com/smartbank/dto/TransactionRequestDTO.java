package com.smartbank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class TransactionRequestDTO {
    private Long id;

    @NotNull(message = "Transaction type is required")
    @Pattern(regexp = "DEPOSIT|WITHDRAWAL|TRANSFER", message = "Invalid transaction type")
    private String transactionType;

    @Pattern(regexp = "PENDING|COMPLETED|FAILED", message = "Invalid transaction status")
    private String transactionStatus;

    @NotBlank
    private String sourceAccountNumber;

    private String targetAccountNumber;

    @NotBlank(message = "PIN is required")
    private String pin;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private LocalDateTime transactionDate;
}
