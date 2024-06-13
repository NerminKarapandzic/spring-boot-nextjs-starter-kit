package com.example.backend.s3.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.s3")
@Setter
@Getter
public class S3Configuration {
  private String bucketName;
  private String region;
  private String accessKey;
  private String secretKey;
  private String baseUrl;
  private String storageClass;
}
