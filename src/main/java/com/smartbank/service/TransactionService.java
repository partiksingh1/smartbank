package com.smartbank.service;

import com.smartbank.dto.TransactionRequestDTO;
import com.smartbank.dto.TransactionResponseDTO;

import java.util.List;

public interface TransactionService {
    TransactionResponseDTO createTransaction(TransactionRequestDTO transactionDTO);

    TransactionResponseDTO getTransactionById(Long id);

    List<TransactionResponseDTO> getAllTransactions();

    void deleteTransaction(Long id);
}
