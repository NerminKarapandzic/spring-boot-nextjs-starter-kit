package com.example.backend.users;

import com.example.backend.entity.AbstractEntity;
import com.example.backend.users.data.CreateUserRequest;
import com.example.backend.util.ApplicationContextProvider;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * User is an entity that can be authenticated and authorized to access the application.
 */
@Entity
@Getter
@NoArgsConstructor
public class User extends AbstractEntity {
  private String email;
  private String password;
  private String firstName;
  private String lastName;
  private boolean verified = false;
  @Enumerated(EnumType.STRING)
  private Role role;

  public User(CreateUserRequest data) {
    PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
    this.email = data.getEmail();
    this.password = passwordEncoder.encode(data.getPassword());
    this.firstName = data.getFirstName();
    this.lastName = data.getLastName();
    this.role = Role.USER;
  }
}
