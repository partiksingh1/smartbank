package com.smartbank.service;

import com.smartbank.dto.LoginRequestDTO;
import com.smartbank.dto.LoginResponseDTO;
import com.smartbank.dto.UserRequestDTO;
import com.smartbank.dto.UserResponseDTO;

import java.util.List;


public interface UserService {
    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);
    UserResponseDTO createUser(UserRequestDTO userRequestDTO);
    UserResponseDTO getUserById(Long id);
    List<UserResponseDTO> getAllUsers();
}
