package com.example.backend.config;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
@Setter
@Getter
public class ApplicationProperties {
  private List<String> allowedOrigins;
  private String applicationName;
  private String baseUrl;
  private String loginPageUrl;
  private String loginSuccessUrl;
  private String adminUserEmail;
  private String adminUserPassword;
  private String vapidPublicKey;
  private String vapidPrivateKey;
  private String vapidSubject;
}
