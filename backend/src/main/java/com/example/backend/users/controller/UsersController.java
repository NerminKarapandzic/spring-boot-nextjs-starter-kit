package com.example.backend.users.controller;

import com.example.backend.config.ApplicationProperties;
import com.example.backend.users.data.CreateUserRequest;
import com.example.backend.users.data.ForgotPasswordRequest;
import com.example.backend.users.data.UpdateUserPasswordRequest;
import com.example.backend.users.data.UpdateUserRequest;
import com.example.backend.users.data.UserResponse;
import com.example.backend.users.service.UserService;
import com.example.backend.util.Client;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Client
public class UsersController {

  private final UserService userService;
  private final ApplicationProperties applicationProperties;

  /**
   * Register a new user. The user will be created with the default role USER. Verification email will
   * be sent to the user.
   */
  @PostMapping
  public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
    UserResponse user = userService.create(request);
    return ResponseEntity.ok(user);
  }


  /**
   * Verify the email of the user, redirect to the login page.
   */
  @GetMapping("/verify-email")
  public RedirectView verifyEmail(@RequestParam String token) {
    userService.verifyEmail(token);
    return new RedirectView(applicationProperties.getLoginPageUrl());
  }

  /**
   * Request a password reset email
   */
  @PostMapping("/forgot-password")
  public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
    userService.forgotPassword(req.getEmail());
    return ResponseEntity.ok().build();
  }

  /**
   * Reset the password of an existing user, uses the password reset token
   * <p>
   * Only allowed with the password reset token
   */
  @PatchMapping("/reset-password")
  public ResponseEntity<Void> resetPassword(
      @Valid @RequestBody UpdateUserPasswordRequest requestDTO) {
    userService.resetPassword(requestDTO);
    return ResponseEntity.ok().build();
  }

  /**
   * Update an existing user.
   * <p>
   * Only allowed to self.
   */
  @PutMapping("/{id}")
  public ResponseEntity<UserResponse> updateUser(@Valid @RequestBody UpdateUserRequest request) {
    UserResponse user = userService.update(request);
    return ResponseEntity.ok(user);
  }

  /**
   * Update the password of an existing user.
   * <p>
   * Only allowed with the correct old password
   */
  @PatchMapping("/password")
  public ResponseEntity<UserResponse> updatePassword(
      @Valid @RequestBody UpdateUserPasswordRequest requestDTO) {
    UserResponse user = userService.updatePassword(requestDTO);
    return ResponseEntity.ok(user);
  }

  /**
   * Update users profile picture.
   * Receives a multipart file
   */
  @PatchMapping("/{id}/profile-picture")
  public ResponseEntity<UserResponse> updateProfilePicture(
      @PathVariable Long id, @RequestParam("file") MultipartFile file) {
    UserResponse user = userService.updateProfilePicture(file);
    return ResponseEntity.ok(user);
  }
}
