package com.example.backend.pushNotifications;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationSubscriptionRepository extends JpaRepository<PushNotificationSubscription, Long> {

}
