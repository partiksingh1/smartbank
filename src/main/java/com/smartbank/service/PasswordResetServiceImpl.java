package com.smartbank.service;

import com.smartbank.dto.PasswordResetVerifyDTO;
import com.smartbank.entity.PasswordResetToken;
import com.smartbank.entity.User;
import com.smartbank.repository.PasswordResetTokenRepo;
import com.smartbank.repository.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService{
    private final UserRepo userRepo;
    private final PasswordResetTokenRepo tokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Override
    public void sendResetOtp(String email){
        User user = userRepo.findByEmail(email)
                .orElseThrow(()->new EntityNotFoundException("No user with email: " + email));

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiry(LocalDateTime.now().plusMinutes(10));
        tokenRepo.save(token);
        sendEmail(email,"Your OTP is: " + otp);
    }


    @Override
    public void verifyOtpAndResetPassword(PasswordResetVerifyDTO dto) {
        PasswordResetToken token = tokenRepo.findByEmailAndOtpAndUsedFalse(dto.getEmail(), dto.getOtp())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired OTP"));

        if (token.getExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP expired");
        }

        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        token.setUsed(true);
        userRepo.save(user);
        tokenRepo.save(token);
    }

    private void sendEmail(String email, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("SmartBank Password Reset OTP");
        message.setText(content);

        mailSender.send(message);
    }
}
