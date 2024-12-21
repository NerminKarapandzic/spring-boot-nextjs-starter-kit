package com.example.backend.users;

import com.example.backend.entity.AbstractEntity;
import com.example.backend.util.Client;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.RandomStringUtils;

@Entity
@Table(name = "password_reset_token")
@Getter
@NoArgsConstructor
@Client
public class PasswordResetToken extends AbstractEntity {

  private String token;
  private boolean emailSent = false;
  private LocalDateTime expiresAt;

  @ManyToOne
  private User user;

  public PasswordResetToken(User user) {
    this.user = user;
    this.token = RandomStringUtils.random(6, false, true);
  }

  public boolean isExpired() {
    return LocalDateTime.now().isAfter(expiresAt);
  }

  public void onEmailSent() {
    this.emailSent = true;
    this.expiresAt = LocalDateTime.now().plusMinutes(10);
  }
}
