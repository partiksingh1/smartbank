package com.smartbank.service;

import com.smartbank.dto.TransactionRequestDTO;
import com.smartbank.dto.TransactionResponseDTO;
import com.smartbank.entity.Account;
import com.smartbank.entity.Transaction;
import com.smartbank.entity.enums.TransactionStatus;
import com.smartbank.entity.enums.TransactionType;
import com.smartbank.repository.AccountRepo;
import com.smartbank.repository.TransactionRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
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
     private final PasswordEncoder passwordEncoder;
     @Override
     @Transactional
     public TransactionResponseDTO createTransaction(TransactionRequestDTO dto) {
          Transaction tx = new Transaction();
          tx.setTransactionType(TransactionType.valueOf(dto.getTransactionType().toUpperCase()));
          tx.setTransactionStatus(TransactionStatus.PENDING);
          tx.setAmount(dto.getAmount());
          tx.setTransactionDate(LocalDateTime.now());

          Account source = accountRepo.lockByAccountNumber(dto.getSourceAccountNumber())
                  .orElseThrow(() -> new EntityNotFoundException("Source account not found"));
          tx.setSourceAccount(source);
          if (!passwordEncoder.matches(dto.getPin(), source.getPin())) {
               throw new SecurityException("Invalid PIN");
          }

          Account target = null;
          if ("TRANSFER".equalsIgnoreCase(dto.getTransactionType())) {
               target = accountRepo.lockByAccountNumber(dto.getTargetAccountNumber())
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
     public TransactionResponseDTO getTransactionById(Long id) {
          Transaction transaction = transactionRepo.findById(id)
                  .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));
          return mapToDTO(transaction);
     }

     @Override
     public List<TransactionResponseDTO> getAllTransactions() {
          return transactionRepo.findAll().stream()
                  .map(this::mapToDTO)
                  .collect(Collectors.toList());
     }

     @Override
     public void deleteTransaction(Long id) {
          transactionRepo.deleteById(id);
     }
     private TransactionResponseDTO mapToDTO(Transaction transaction) {
          TransactionResponseDTO dto = new TransactionResponseDTO();
          dto.setId(transaction.getId());
          dto.setTransactionType(String.valueOf(transaction.getTransactionType()));
          dto.setTransactionStatus(String.valueOf(transaction.getTransactionStatus()));
          dto.setAmount(transaction.getAmount());
          dto.setTransactionDate(transaction.getTransactionDate());
          return dto;
     }
}
