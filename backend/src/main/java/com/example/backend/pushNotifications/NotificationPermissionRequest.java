package com.example.backend.pushNotifications;

import com.example.backend.util.Client;
import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

@Entity
@Client
@Getter
@NoArgsConstructor
public class NotificationPermissionRequest {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Nullable
  private Long id;

  private RequestEvent requestedBy;
  private DeniedReason deniedReason;

  @CreatedDate
  @Nullable
  private LocalDateTime createdAt;

  public NotificationPermissionRequest(RequestEvent requestedBy, DeniedReason deniedReason) {
    this.requestedBy = requestedBy;
    this.deniedReason = deniedReason;
  }

  public enum RequestEvent {
    ONLOAD,
    USER_INTERACTION
  }

  public enum DeniedReason {
    NOT_SUPPORTED,
    NOT_GRANTED
  }
}
