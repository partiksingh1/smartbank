package com.smartbank.service;

import com.smartbank.dto.AccountRequestDTO;
import com.smartbank.dto.AccountResponseDTO;

import java.util.List;

public interface AccountService{
    AccountResponseDTO createAccount(AccountRequestDTO accountDTO);
    AccountResponseDTO getAccountByUserId();
    List<AccountResponseDTO> getAllAccounts();
}
