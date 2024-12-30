package com.example.backend.pushNotifications;

import com.example.backend.util.Client;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@NoArgsConstructor
@Client
public class PushNotificationSubscription {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(columnDefinition = "TEXT", unique = true)
  private String endpoint;

  @Column(name = "p256dh_key")
  private String p256dhKey;

  @Column(name = "auth_key")
  private String authKey;

  @CreationTimestamp
  private LocalDateTime createdAt;

  public PushNotificationSubscription(String endpoint, String p256dhKey, String authKey) {
    this.endpoint = endpoint;
    this.p256dhKey = p256dhKey;
    this.authKey = authKey;
  }
}
