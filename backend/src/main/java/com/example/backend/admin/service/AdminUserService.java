package com.example.backend.admin.service;

import com.example.backend.users.User;
import com.example.backend.users.data.UserResponse;
import com.example.backend.users.repository.UserRepository;
import com.example.backend.util.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminUserService {
  private final UserRepository userRepository;

  public PagedResponse<UserResponse> getUsers(int page) {
    Pageable pageable = PageRequest.of(page, 10);
    Page<User> users = userRepository.findAll(pageable);
    return new PagedResponse<>(users.map(UserResponse::new));
  }
}
