package com.example.backend.users.service;

import com.example.backend.config.ApplicationProperties;
import com.example.backend.users.Role;
import com.example.backend.users.User;
import com.example.backend.users.data.CreateUserRequest;
import com.example.backend.users.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AdminUserSeeder implements ApplicationRunner {

  private final UserRepository userRepository;
  private final ApplicationProperties applicationProperties;

  public AdminUserSeeder(UserRepository userRepository,
      ApplicationProperties applicationProperties) {
    this.userRepository = userRepository;
    this.applicationProperties = applicationProperties;
  }

  @Override
  public void run(ApplicationArguments args) throws Exception {
    // Finds the user defined in application properties
    User adminUser = userRepository.findByEmail(applicationProperties.getAdminUserEmail())
        .orElse(null);
    if (adminUser == null) {
      // Creates the admin user if it does not exist
      adminUser = new User(CreateUserRequest.builder()
          .email(applicationProperties.getAdminUserEmail())
          .password((applicationProperties.getAdminUserPassword()))
          .build());
      adminUser.setRole(Role.ADMIN);
      userRepository.save(adminUser);
      log.info("Admin user created with email: {}", adminUser.getEmail());
    }
  }
}
