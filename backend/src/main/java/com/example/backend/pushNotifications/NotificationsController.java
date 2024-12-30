package com.example.backend.pushNotifications;

import com.example.backend.pushNotifications.projections.NotificationSubscribersByDate;
import com.example.backend.pushNotifications.projections.NotificationsByDate;
import com.example.backend.util.Client;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
@Client
public class NotificationsController {

  private final NotificationService notificationService;

  @PostMapping("/subscribe")
  public ResponseEntity<Void> pushNotificationSubscribe(@RequestBody SubscriptionRequest request) {
    log.info("Received subscription request: {}", request);
    notificationService.saveSubscription(request);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/denied")
  public ResponseEntity<Void> pushNotificationRequestDenied(@RequestBody NotificationPermissionRequest request) {
    log.info("Received notification permission request denied: {}", request);
    notificationService.saveDeniedRequest(request);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/notify")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<Void> pushNotificationNotify(@RequestBody SendNotificationRequest request) {
    log.info("Sending push notification to all subscribers: title: {}, message: {}", request.getTitle(), request.getMessage());
    notificationService.sendNotification(request.getTitle(), request.getMessage(), request.getUrl());
    return ResponseEntity.ok().build();
  }

  @PostMapping("/delivery/{id}")
  public ResponseEntity<Void> pushNotificationDelivery(
      @PathVariable Long id
  ) {
    notificationService.saveDelivery(id);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/stats/delivery")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<List<NotificationsByDate>> getNotificationDeliveryStats(
      @RequestParam(required = false) LocalDateTime from,
      @RequestParam(required = false) LocalDateTime to
  ) {
    return ResponseEntity.ok(notificationService.getDeliveryStats(from, to));
  }

  @GetMapping("/stats/subscriptions")
  @PreAuthorize("hasRole('ROLE_ADMIN')")
  public ResponseEntity<List<NotificationSubscribersByDate>> getNotificationSubscriptionStats(
      @RequestParam(required = false) LocalDateTime from,
      @RequestParam(required = false) LocalDateTime to
  ) {
    return ResponseEntity.ok(notificationService.getSubscriptionStats(from, to));
  }

}
