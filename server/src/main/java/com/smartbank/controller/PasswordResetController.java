package com.smartbank.controller;

import com.smartbank.dto.PasswordResetRequestDTO;
import com.smartbank.dto.PasswordResetVerifyDTO;
import com.smartbank.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/otp")
@RequiredArgsConstructor
public class PasswordResetController {
    private final PasswordResetService passwordResetService;

    @PostMapping("/request")
    public ResponseEntity<String> requestReset(@RequestBody @Valid PasswordResetRequestDTO dto) {
        passwordResetService.sendResetOtp(dto.getEmail());
        return ResponseEntity.ok("OTP sent to your email.");
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid PasswordResetVerifyDTO dto) {
        passwordResetService.verifyOtpAndResetPassword(dto);
        return ResponseEntity.ok("Password reset successful.");
    }
}
