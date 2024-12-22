package com.example.backend.pushNotifications;

import com.example.backend.util.Client;
import lombok.Data;

@Data
@Client
public class SendNotificationRequest {
  private String title;
  private String message;
  private String url;
}
