package com.smartbank.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.smartbank.entity.enums.TransactionStatus;
import com.smartbank.entity.enums.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class TransactionDTO {

    private Long id;

    @NotNull(message = "Transaction type is required")
    @Pattern(regexp = "DEPOSIT|WITHDRAWAL|TRANSFER", message = "Invalid transaction type")
    private String transactionType;


    private String transactionStatus;

    private String sourceAccountNumber;
    private String targetAccountNumber;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private LocalDateTime transactionDate;

    @NotNull(message = "Source account ID is required")
    private Long sourceAccountId;

    private Long targetAccountId; // Optional for DEPOSIT/WITHDRAWAL
}

