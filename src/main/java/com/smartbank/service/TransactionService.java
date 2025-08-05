package com.smartbank.service;

import com.smartbank.dto.TransactionDTO;

import java.util.List;

public interface TransactionService {
    TransactionDTO createTransaction(TransactionDTO transactionDTO);

    TransactionDTO getTransactionById(Long id);

    List<TransactionDTO> getAllTransactions();

    void deleteTransaction(Long id);
}
