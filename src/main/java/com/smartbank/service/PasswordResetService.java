package com.smartbank.service;

import com.smartbank.dto.PasswordResetVerifyDTO;

public interface PasswordResetService {
    void sendResetOtp(String email);
    void verifyOtpAndResetPassword(PasswordResetVerifyDTO dto);
}
