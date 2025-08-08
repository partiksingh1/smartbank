package com.smartbank.controller;

import com.smartbank.dto.AccountRequestDTO;
import com.smartbank.dto.AccountResponseDTO;
import com.smartbank.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/account")
    public ResponseEntity<AccountResponseDTO> createAccount(@Valid @RequestBody AccountRequestDTO accountDTO){
        AccountResponseDTO createAccount = accountService.createAccount(accountDTO);
        return  new ResponseEntity<>(createAccount, HttpStatus.CREATED);
    }

    @GetMapping("/account")
    public ResponseEntity<AccountResponseDTO> getAccountById() {
        AccountResponseDTO account = accountService.getAccountByUserId();
        return new ResponseEntity<>(account, HttpStatus.OK);
    }

    @GetMapping("/admin/accounts")
    public ResponseEntity<List<AccountResponseDTO>> getAllAccounts() {
        List<AccountResponseDTO> accounts = accountService.getAllAccounts();
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }
}
