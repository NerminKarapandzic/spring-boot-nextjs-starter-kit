package com.example.backend.users;

import com.example.backend.entity.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class UserConnectedAccount extends AbstractEntity {
  private String provider;
  private String providerId;
  private LocalDateTime connectedAt;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  public UserConnectedAccount(String provider, String providerId, User user) {
    this.provider = provider;
    this.providerId = providerId;
    this.connectedAt = LocalDateTime.now();
    this.user = user;
  }
}
