package com.example.backend.pushNotifications.projections;

import com.example.backend.util.Client;

@Client
public interface NotificationSubscribersByDate {
  String getDate();
  long getSubscribers();
}
