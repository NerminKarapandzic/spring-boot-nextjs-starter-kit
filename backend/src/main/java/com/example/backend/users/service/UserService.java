package com.example.backend.users.service;

import com.example.backend.users.PasswordResetToken;
import com.example.backend.users.User;
import com.example.backend.users.VerificationCode;
import com.example.backend.users.data.CreateUserRequest;
import com.example.backend.users.data.UserResponse;
import com.example.backend.users.jobs.SendResetPasswordEmailJob;
import com.example.backend.users.jobs.SendWelcomeEmailJob;
import com.example.backend.users.repository.PasswordResetTokenRepository;
import com.example.backend.users.repository.UserRepository;
import com.example.backend.users.repository.VerificationCodeRepository;
import com.example.backend.util.exception.ApiException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final VerificationCodeRepository verificationCodeRepository;
  private final PasswordResetTokenRepository passwordResetTokenRepository;

  @Transactional
  public UserResponse create(@Valid CreateUserRequest request) {
    User user = new User(request);
    user = userRepository.save(user);
    sendVerificationEmail(user);
    return new UserResponse(user);
  }

  private void sendVerificationEmail(User user) {
    VerificationCode verificationCode = new VerificationCode(user);
    user.setVerificationCode(verificationCode);
    verificationCodeRepository.save(verificationCode);
    SendWelcomeEmailJob sendWelcomEmailJob = new SendWelcomeEmailJob(user.getId());
    BackgroundJobRequest.enqueue(sendWelcomEmailJob);
  }

  @Transactional
  public void verifyEmail(String code) {
    VerificationCode verificationCode = verificationCodeRepository.findByCode(code)
        .orElseThrow(() -> ApiException.builder().status(400).message("Invalid token").build());
    User user = verificationCode.getUser();
    user.setVerified(true);
    userRepository.save(user);
    verificationCodeRepository.delete(verificationCode);
  }

  @Transactional
  public void forgotPassword(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> ApiException.builder().status(404).message("User not found").build());
    PasswordResetToken passwordResetToken = new PasswordResetToken(user);
    passwordResetTokenRepository.save(passwordResetToken);
    SendResetPasswordEmailJob sendResetPasswordEmailJob = new SendResetPasswordEmailJob(passwordResetToken.getId());
    BackgroundJobRequest.enqueue(sendResetPasswordEmailJob);
  }
}
