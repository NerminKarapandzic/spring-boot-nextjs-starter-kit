package com.example.backend.users.service;

import com.example.backend.users.User;
import com.example.backend.users.VerificationCode;
import com.example.backend.users.data.CreateUserRequest;
import com.example.backend.users.data.UserResponse;
import com.example.backend.users.jobs.SendWelcomeEmailJob;
import com.example.backend.users.repository.UserRepository;
import com.example.backend.users.repository.VerificationCodeRepository;
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
}
