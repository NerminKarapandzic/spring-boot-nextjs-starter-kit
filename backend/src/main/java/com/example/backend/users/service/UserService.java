package com.example.backend.users.service;

import com.example.backend.users.User;
import com.example.backend.users.data.CreateUserRequest;
import com.example.backend.users.data.UserResponse;
import com.example.backend.users.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  @Transactional
  public UserResponse create(@Valid CreateUserRequest request) {
    User user = new User(request);
    user = userRepository.save(user);

    // TODO: Send verification email

    return new UserResponse(user);
  }

}
