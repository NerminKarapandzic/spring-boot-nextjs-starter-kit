package com.example.backend.pushNotifications;

import com.example.backend.pushNotifications.projections.NotificationSubscribersByDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationSubscriptionRepository extends JpaRepository<PushNotificationSubscription, Long> {

  @Query("""
    SELECT 
        DATE(n.createdAt) as date,
        COUNT(n) as subscribers
    FROM PushNotificationSubscription n
    WHERE n.createdAt BETWEEN :start AND :end
    GROUP BY DATE(n.createdAt)
    ORDER BY date
    """)
  List<NotificationSubscribersByDate> countByCreatedAtBetween(
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end
  );
}
