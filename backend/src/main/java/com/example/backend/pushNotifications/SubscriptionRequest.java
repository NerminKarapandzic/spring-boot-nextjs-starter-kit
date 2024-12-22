package com.example.backend.pushNotifications;

import com.example.backend.util.Client;
import lombok.Data;

@Data
@Client
public class SubscriptionRequest {
  private String endpoint;
  private String p256dh;
  private String auth;
}
