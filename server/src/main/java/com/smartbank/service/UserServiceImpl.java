package com.smartbank.service;

import com.smartbank.dto.LoginRequestDTO;
import com.smartbank.dto.LoginResponseDTO;
import com.smartbank.dto.UserRequestDTO;
import com.smartbank.dto.UserResponseDTO;
import com.smartbank.entity.User;
import com.smartbank.exception.UserNotFoundException;
import com.smartbank.repository.UserRepo;
import com.smartbank.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final JwtUtil jwtUtil;

    @Override
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {
        if (userRepo.existsByEmail(userRequestDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = modelMapper.map(userRequestDTO, User.class);
        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));

        User savedUser = userRepo.save(user);
        return modelMapper.map(savedUser, UserResponseDTO.class);
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO){
        User user = userRepo.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + loginRequestDTO.getEmail()));
        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password"); // You can create a custom exception instead
        }
        String token = jwtUtil.generateToken(loginRequestDTO.getEmail());

        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setUser(user);
        response.setMessage("Login successful");

        return response;

    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user =  userRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return modelMapper.map(user, UserResponseDTO.class);
    }
    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepo.findAll().stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .toList();
    }

}
