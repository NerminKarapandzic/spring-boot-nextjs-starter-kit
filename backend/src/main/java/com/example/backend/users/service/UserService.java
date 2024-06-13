package com.example.backend.users.service;

import com.example.backend.auth.SecurityUtil;
import com.example.backend.s3.UploadedFile;
import com.example.backend.s3.repository.UploadedFileRepository;
import com.example.backend.s3.service.FileUploadService;
import com.example.backend.users.PasswordResetToken;
import com.example.backend.users.User;
import com.example.backend.users.VerificationCode;
import com.example.backend.users.data.CreateUserRequest;
import com.example.backend.users.data.UpdateUserPasswordRequest;
import com.example.backend.users.data.UpdateUserRequest;
import com.example.backend.users.data.UserResponse;
import com.example.backend.users.jobs.SendResetPasswordEmailJob;
import com.example.backend.users.jobs.SendWelcomeEmailJob;
import com.example.backend.users.repository.PasswordResetTokenRepository;
import com.example.backend.users.repository.UserRepository;
import com.example.backend.users.repository.VerificationCodeRepository;
import com.example.backend.util.exception.ApiException;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final VerificationCodeRepository verificationCodeRepository;
  private final PasswordResetTokenRepository passwordResetTokenRepository;
  private final UploadedFileRepository uploadedFileRepository;
  private final PasswordEncoder passwordEncoder;
  private final FileUploadService fileUploadService;

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

  @Transactional
  public void resetPassword(UpdateUserPasswordRequest request) {
    PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(request.getPasswordResetToken())
        .orElseThrow(() -> ApiException.builder().status(404).message("Password reset token not found").build());

    if (passwordResetToken.isExpired()) {
      throw ApiException.builder().status(400).message("Password reset token is expired").build();
    }

    User user = passwordResetToken.getUser();
    user.updatePassword(request.getPassword());
    userRepository.save(user);
  }

  @Transactional
  public UserResponse update(UpdateUserRequest request) {
    User user = SecurityUtil.getAuthenticatedUser();
    user = userRepository.getReferenceById(user.getId());
    user.update(request);
    user = userRepository.save(user);
    return new UserResponse(user);
  }

  @Transactional
  public UserResponse updatePassword(UpdateUserPasswordRequest request) {
    User user = SecurityUtil.getAuthenticatedUser();
    if (user.getPassword() != null && !passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
      throw ApiException.builder().status(400).message("Wrong password").build();
    }

    user.updatePassword(request.getPassword());
    user = userRepository.save(user);
    return new UserResponse(user);
  }

  public UserResponse updateProfilePicture(MultipartFile file) {
    User user = SecurityUtil.getAuthenticatedUser();
    UploadedFile uploadedFile = new UploadedFile(file.getOriginalFilename(), file.getSize(), user);
    try {
      String url = fileUploadService.uploadFile(
          uploadedFile.buildPath("profile-picture"),
          file.getBytes());
      uploadedFile.onUploaded(url);
      user.setProfileImageUrl(url);
      userRepository.save(user);
      uploadedFileRepository.save(uploadedFile);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }

    return new UserResponse(user);
  }
}
