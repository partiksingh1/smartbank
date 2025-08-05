package com.smartbank.service;

import com.smartbank.dto.UserRequestDTO;
import com.smartbank.dto.UserResponseDTO;

import java.util.List;


public interface UserService {
    UserResponseDTO createUser(UserRequestDTO userRequestDTO);
    UserResponseDTO getUserById(Long id);
    List<UserResponseDTO> getAllUsers();
}
