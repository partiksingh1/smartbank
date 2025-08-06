package com.smartbank.controller;

import com.smartbank.dto.LoginRequestDTO;
import com.smartbank.dto.LoginResponseDTO;
import com.smartbank.dto.UserRequestDTO;
import com.smartbank.dto.UserResponseDTO;
import com.smartbank.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO userDTO) {
        UserResponseDTO savedUser = userService.createUser(userDTO);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO userDTO) {
        LoginResponseDTO loginUser = userService.login(userDTO);
        return new ResponseEntity<>(loginUser, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

}
