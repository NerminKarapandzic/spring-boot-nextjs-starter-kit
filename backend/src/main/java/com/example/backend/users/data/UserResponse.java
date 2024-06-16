package com.example.backend.users.data;

import com.example.backend.users.Role;
import com.example.backend.users.User;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class UserResponse {
  private Long id;
  private Role role;
  private String firstName;
  private String lastName;
  private String email;
  private String profileImageUrl;
  private List<ConnectedAccountResponse> connectedAccounts = new ArrayList<>();

  public UserResponse(User user) {
    this.id = user.getId();
    this.role = user.getRole();
    this.firstName = user.getFirstName();
    this.lastName = user.getLastName();
    this.email = user.getEmail();
    this.profileImageUrl = user.getProfileImageUrl();
    user.getConnectedAccounts().forEach((provider) -> {
      this.connectedAccounts.add(new ConnectedAccountResponse(provider.getProvider(), provider.getConnectedAt()));
    });
  }
  public record ConnectedAccountResponse(String provider, LocalDateTime connectedAt) {
  }
}
