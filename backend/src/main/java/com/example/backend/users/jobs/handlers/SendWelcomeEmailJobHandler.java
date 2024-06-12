package com.example.backend.users.jobs.handlers;

import com.example.backend.config.ApplicationProperties;
import com.example.backend.email.EmailService;
import com.example.backend.users.User;
import com.example.backend.users.VerificationCode;
import com.example.backend.users.jobs.SendWelcomeEmailJob;
import com.example.backend.users.repository.UserRepository;
import com.example.backend.users.repository.VerificationCodeRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Component
@Slf4j
@RequiredArgsConstructor
public class SendWelcomeEmailJobHandler implements JobRequestHandler<SendWelcomeEmailJob> {

  private final UserRepository userRepository;
  private final VerificationCodeRepository verificationCodeRepository;
  private final SpringTemplateEngine templateEngine;
  private final EmailService emailService;
  private final ApplicationProperties applicationProperties;

  @Override
  @Transactional
  public void run(SendWelcomeEmailJob sendWelcomEmailJob) throws Exception {
    User user = userRepository.findById(sendWelcomEmailJob.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
    log.info("Sending welcome email to user with id: {}", sendWelcomEmailJob.getUserId());
    if (user.getVerificationCode() != null && !user.getVerificationCode().isEmailSent()) {
      sendWelcomeEmail(user, user.getVerificationCode());
    }
  }

  private void sendWelcomeEmail(User user, VerificationCode code) {
    String verificationLink = applicationProperties.getBaseUrl() + "/api/users/verify-email?token=" + code.getCode();
    Context thymeleafContext = new Context();
    thymeleafContext.setVariable("user", user);
    thymeleafContext.setVariable("verificationLink", verificationLink);
    thymeleafContext.setVariable("applicationName", applicationProperties.getApplicationName());
    String htmlBody = templateEngine.process("welcome-email", thymeleafContext);
    emailService.sendHtmlMessage(List.of(user.getEmail()), "Welcome to our platform", htmlBody);
    code.setEmailSent(true);
    verificationCodeRepository.save(code);
  }
}