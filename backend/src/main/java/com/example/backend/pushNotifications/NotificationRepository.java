package com.example.backend.pushNotifications;

import com.example.backend.pushNotifications.projections.NotificationsByDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

  @Query("""
    SELECT 
        DATE(n.createdAt) as date,
        COUNT(n) as sent,
        SUM(CASE WHEN n.delivered = true THEN 1 ELSE 0 END) as delivered
    FROM Notification n
    WHERE n.createdAt BETWEEN :start AND :end
    GROUP BY DATE(n.createdAt)
    ORDER BY date
    """)
  List<NotificationsByDate> countByCreatedAtBetween(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
  );
}
