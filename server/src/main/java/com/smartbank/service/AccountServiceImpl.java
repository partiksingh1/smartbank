package com.smartbank.service;

import com.smartbank.dto.AccountRequestDTO;
import com.smartbank.dto.AccountResponseDTO;
import com.smartbank.entity.Account;
import com.smartbank.entity.User;
import com.smartbank.entity.enums.AccountType;
import com.smartbank.repository.AccountRepo;
import com.smartbank.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
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
        Account account = new Account();
        account.setAccountNumber(accountDTO.getAccountNumber());
        account.setAccountType(AccountType.valueOf(accountDTO.getAccountType()));
        account.setBalance(accountDTO.getBalance());
        account.setBranch(accountDTO.getBranch());
        account.setPin(passwordEncoder.encode(accountDTO.getPin()));
        User user = userRepo.findById(accountDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + accountDTO.getUserId()));

        account.setUser(user);
        Account savedAccount = accountRepo.save(account);
        return mapToResponseDTO(savedAccount);
    }

    @Override
    public AccountResponseDTO getAccountById(Long id) {
        Account account = accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));

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
