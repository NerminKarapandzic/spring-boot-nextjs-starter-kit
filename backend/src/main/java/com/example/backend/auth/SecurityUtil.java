package com.example.backend.auth;

import com.example.backend.users.User;
import com.example.backend.util.exception.ApiException;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

@Slf4j
public class SecurityUtil {
  private static final SecurityContextRepository securityContextRepository =
      new HttpSessionSecurityContextRepository();

  /**
   * Get the authenticated user from the SecurityContextHolder
   * @throws com.example.backend.util.exception.ApiException if the user is not found in the SecurityContextHolder
   */
  public static User getAuthenticatedUser() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principal instanceof User user) {
      return user;
    }else {
      log.error("User requested but not found in SecurityContextHolder");
      throw ApiException.builder().status(401).message("Authentication required").build();
    }
  }

  public static Optional<User> getOptionalAuthenticatedUser() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principal instanceof User user) {
      return Optional.of(user);
    } else {
      return Optional.empty();
    }
  }
}