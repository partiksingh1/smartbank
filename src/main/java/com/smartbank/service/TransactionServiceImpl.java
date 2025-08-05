package com.smartbank.service;

import com.smartbank.dto.TransactionDTO;
import com.smartbank.entity.Account;
import com.smartbank.entity.Transaction;
import com.smartbank.entity.enums.TransactionStatus;
import com.smartbank.entity.enums.TransactionType;
import com.smartbank.repository.AccountRepo;
import com.smartbank.repository.TransactionRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService{
     private final TransactionRepo transactionRepo;
     private final AccountRepo accountRepo;

     @Override
     @Transactional
     public TransactionDTO createTransaction(TransactionDTO dto) {
          Transaction tx = new Transaction();
          tx.setTransactionType(TransactionType.valueOf(dto.getTransactionType().toUpperCase()));
          tx.setTransactionStatus(TransactionStatus.PENDING);
          tx.setAmount(dto.getAmount());
          tx.setTransactionDate(LocalDateTime.now());

          Account source = accountRepo.findByAccountNumber(dto.getSourceAccountNumber())
                  .orElseThrow(() -> new EntityNotFoundException("Source account not found"));
          tx.setSourceAccount(source);

          Account target = null;
          if ("TRANSFER".equalsIgnoreCase(dto.getTransactionType())) {
               target = accountRepo.findByAccountNumber(dto.getTargetAccountNumber())
                       .orElseThrow(() -> new EntityNotFoundException("Target account not found"));
               tx.setTargetAccount(target);
          }

          Transaction savedPending = transactionRepo.save(tx);

          try {
               switch (tx.getTransactionType()) {
                    case TRANSFER -> {
                         if (source.getBalance().compareTo(dto.getAmount()) < 0)
                              throw new IllegalArgumentException("Insufficient balance");
                         source.setBalance(source.getBalance().subtract(dto.getAmount()));
                         target.setBalance(target.getBalance().add(dto.getAmount()));
                    }
                    case WITHDRAWAL -> {
                         if (source.getBalance().compareTo(dto.getAmount()) < 0)
                              throw new IllegalArgumentException("Insufficient balance");
                         source.setBalance(source.getBalance().subtract(dto.getAmount()));
                    }
                    case DEPOSIT -> source.setBalance(source.getBalance().add(dto.getAmount()));
               }

               accountRepo.save(source);
               if (target != null) accountRepo.save(target);

               savedPending.setTransactionStatus(TransactionStatus.COMPLETED);
               Transaction completed = transactionRepo.save(savedPending);
               return mapToDTO(completed);

          } catch (Exception ex) {
               savedPending.setTransactionStatus(TransactionStatus.FAILED);
               transactionRepo.save(savedPending);
               throw ex;
          }
     }


     @Override
     public TransactionDTO getTransactionById(Long id) {
          Transaction transaction = transactionRepo.findById(id)
                  .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));
          return mapToDTO(transaction);
     }

     @Override
     public List<TransactionDTO> getAllTransactions() {
          return transactionRepo.findAll().stream()
                  .map(this::mapToDTO)
                  .collect(Collectors.toList());
     }

     @Override
     public void deleteTransaction(Long id) {
          transactionRepo.deleteById(id);
     }
     private TransactionDTO mapToDTO(Transaction transaction) {
          TransactionDTO dto = new TransactionDTO();
          dto.setId(transaction.getId());
          dto.setTransactionType(String.valueOf(transaction.getTransactionType()));
          dto.setTransactionStatus(String.valueOf(transaction.getTransactionStatus()));
          dto.setAmount(transaction.getAmount());
          dto.setTransactionDate(transaction.getTransactionDate());
          dto.setSourceAccountId(transaction.getSourceAccount() != null ? transaction.getSourceAccount().getId() : null);
          dto.setTargetAccountId(transaction.getTargetAccount() != null ? transaction.getTargetAccount().getId() : null);
          return dto;
     }
}
