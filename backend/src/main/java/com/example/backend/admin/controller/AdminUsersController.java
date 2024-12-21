package com.example.backend.admin.controller;

import com.example.backend.admin.service.AdminUserService;
import com.example.backend.users.data.UserResponse;
import com.example.backend.util.Client;
import com.example.backend.util.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Client
public class AdminUsersController {

  private final AdminUserService userService;

  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<PagedResponse<UserResponse>> admin_getUsers(
      @RequestParam(value = "page", defaultValue = "0") int page
  ) {
    PagedResponse<UserResponse> users = userService.getUsers(page);
    return ResponseEntity.ok(users);
  }

}
