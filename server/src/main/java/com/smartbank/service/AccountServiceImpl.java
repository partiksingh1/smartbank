package com.smartbank.service;

import com.smartbank.dto.AccountRequestDTO;
import com.smartbank.dto.AccountResponseDTO;
import com.smartbank.entity.Account;
import com.smartbank.entity.User;
import com.smartbank.entity.enums.AccountType;
import com.smartbank.exception.UserNotFoundException;
import com.smartbank.repository.AccountRepo;
import com.smartbank.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final AccountRepo accountRepo;
    private final UserRepo userRepo;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AccountResponseDTO createAccount(AccountRequestDTO accountDTO){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        Account account = new Account();
        account.setAccountNumber(generateRandomAccountNumber());
        account.setAccountType(AccountType.valueOf(accountDTO.getAccountType()));
        account.setBalance(accountDTO.getBalance());
        account.setBranch(accountDTO.getBranch());
        account.setPin(passwordEncoder.encode(accountDTO.getPin()));
        account.setUser(user);
        Account savedAccount = accountRepo.save(account);
        return mapToResponseDTO(savedAccount);
    }
    private String generateRandomAccountNumber() {
        long min = 100000000000L; // 12-digit minimum
        long max = 999999999999L; // 12-digit maximum
        long randomNumber = min + (long) (Math.random() * (max - min));
        return String.valueOf(randomNumber);
    }

    @Override
    public AccountResponseDTO getAccountByUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        Long userId = user.getId();
        Account account = accountRepo.findAccountByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + userId));

        return modelMapper.map(account, AccountResponseDTO.class);
    }

    @Override
    public List<AccountResponseDTO> getAllAccounts() {
        return accountRepo.findAll().stream()
                .map(account -> modelMapper.map(account, AccountResponseDTO.class))
                .toList();
    }
    private AccountResponseDTO mapToResponseDTO(Account account) {
        AccountResponseDTO dto = new AccountResponseDTO();
        dto.setId(account.getId());
        dto.setAccountNumber(account.getAccountNumber());
        dto.setAccountType(account.getAccountType().name());
        dto.setBalance(account.getBalance());
        dto.setBranch(account.getBranch());
        dto.setUserId(account.getUser().getId());
        return dto;
    }
}
