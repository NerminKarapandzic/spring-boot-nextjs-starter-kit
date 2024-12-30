package com.example.backend.pushNotifications.projections;

import com.example.backend.util.Client;
import java.time.LocalDateTime;

@Client
public interface NotificationsByDate {
  String getDate();
  long getSent();
  long getDelivered();
}
