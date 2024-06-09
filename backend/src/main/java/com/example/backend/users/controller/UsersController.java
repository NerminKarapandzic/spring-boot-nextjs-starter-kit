package com.example.backend.users.controller;

import com.example.backend.users.data.CreateUserRequest;
import com.example.backend.users.data.UserResponse;
import com.example.backend.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UsersController {

  private final UserService userService;

  /**
   * Register a new user. The user will be created with the default role USER. Verification email will
   * be sent to the user.
   */
  @PostMapping
  public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
    UserResponse user = userService.create(request);
    return ResponseEntity.ok(user);
  }
}
