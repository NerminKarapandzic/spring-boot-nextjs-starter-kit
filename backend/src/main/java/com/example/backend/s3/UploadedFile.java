package com.example.backend.s3;

import com.example.backend.entity.AbstractEntity;
import com.example.backend.users.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@NoArgsConstructor
public class UploadedFile extends AbstractEntity {

  private String url;
  private Long size;
  private String originalFileName;
  private String extension;
  @CreationTimestamp
  private LocalDateTime createdAt;
  private LocalDateTime uploadedAt;

  @ManyToOne
  @JsonIgnore
  private User user;

  public UploadedFile(String originalFileName, Long size, User user) {
    this.originalFileName = originalFileName;
    this.size = size;
    this.user = user;
    this.extension = FilenameUtils.getExtension(originalFileName);
  }

  public void onUploaded(String url) {
    this.url = url;
    this.uploadedAt = LocalDateTime.now();
  }

  public String buildPath(String ...path) {
    StringBuilder sb = new StringBuilder();
    sb.append("user:").append(user.getId()).append("/");
    for (String p : path) {
      sb.append(p).append("/");
    }
    sb.append(UUID.randomUUID());
    sb.append(".").append(extension);
    return sb.toString();
  }
}
