package com.example.backend.users.data;

import com.example.backend.util.Client;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
@Client
public class ForgotPasswordRequest {
  @Email
  private String email;
}
