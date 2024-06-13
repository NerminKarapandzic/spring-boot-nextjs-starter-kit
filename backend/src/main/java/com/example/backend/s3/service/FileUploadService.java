package com.example.backend.s3.service;

import com.example.backend.s3.config.S3Configuration;
import java.net.URI;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class FileUploadService {

  private S3Client s3Client;
  private final S3Configuration s3Configuration;

  public FileUploadService(S3Configuration s3Configuration) {
    this.s3Configuration = s3Configuration;
    AwsCredentials credentials = AwsBasicCredentials.create(
        s3Configuration.getAccessKey(),
        s3Configuration.getSecretKey()
    );
    s3Client = S3Client.builder()
        .endpointOverride(URI.create(s3Configuration.getBaseUrl()))
        .region(Region.of(s3Configuration.getRegion()))
        .credentialsProvider(StaticCredentialsProvider.create(credentials))
        .forcePathStyle(true)
        .build();
  }

  public String uploadFile(String filePath, byte[] file) {
    PutObjectRequest request = PutObjectRequest.builder()
        .bucket(s3Configuration.getBucketName())
        .storageClass(s3Configuration.getStorageClass())
        .key(filePath)
        .acl(ObjectCannedACL.PUBLIC_READ)
        .build();
    s3Client.putObject(request, RequestBody.fromBytes(file));
    try {
      GetUrlRequest getUrlRequest = GetUrlRequest.builder().bucket(s3Configuration.getBucketName()).key(filePath).build();
      return s3Client.utilities().getUrl(getUrlRequest).toURI().toString();
    } catch (Exception e) {
      throw new RuntimeException("Failed to get URL of uploaded file", e);
    }
  }
}
