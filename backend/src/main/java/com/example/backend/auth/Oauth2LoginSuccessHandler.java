package com.example.backend.auth;

import com.example.backend.config.ApplicationProperties;
import com.example.backend.users.User;
import com.example.backend.users.UserConnectedAccount;
import com.example.backend.users.repository.ConnectedAccountRepository;
import com.example.backend.users.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Slf4j
public class Oauth2LoginSuccessHandler implements AuthenticationSuccessHandler {

  private final ConnectedAccountRepository connectedAccountRepository;
  private final ApplicationProperties applicationProperties;
  private final UserRepository userRepository;

  public Oauth2LoginSuccessHandler(ApplicationProperties applicationProperties,
      UserRepository userRepository,
      ConnectedAccountRepository connectedAccountRepository) {
    this.applicationProperties = applicationProperties;
    this.userRepository = userRepository;
    this.connectedAccountRepository = connectedAccountRepository;
  }

  @Override
  @Transactional
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
      Authentication authentication) throws IOException {
    OAuth2AuthenticationToken authenticationToken = (OAuth2AuthenticationToken) authentication;
    String provider = authenticationToken.getAuthorizedClientRegistrationId();
    String providerId = authentication.getName();
    String email = authenticationToken.getPrincipal().getAttribute("email");

    // First check if we have the user based on a connected account (provider / providerId)
    Optional<UserConnectedAccount> connectedAccount = connectedAccountRepository.findByProviderAndProviderId(provider, providerId);
    if (connectedAccount.isPresent()) {
      authenticateUser(connectedAccount.get().getUser(), response);
      return;
    }

    // At this point we don't have a connected account, so we either find a user by email and add the connected account
    // or we create a new user
    User existingUser = userRepository.findByEmail(email).orElse(null);
    if (existingUser != null) {
      UserConnectedAccount newConnectedAccount = new UserConnectedAccount(provider, providerId, existingUser);
      existingUser.addConnectedAccount(newConnectedAccount);
      existingUser = userRepository.save(existingUser);
      connectedAccountRepository.save(newConnectedAccount);
      authenticateUser(existingUser, response);
    } else {
      User newUser = createUserFromOauth2User(authenticationToken);
      authenticateUser(newUser, response);
    }
  }

  private void authenticateUser(User user, HttpServletResponse response) throws IOException {
    UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
    SecurityContextHolder.getContext().setAuthentication(token);
    response.sendRedirect(applicationProperties.getLoginSuccessUrl());
  }

  private User createUserFromOauth2User(OAuth2AuthenticationToken authentication) {
    User user = new User(authentication.getPrincipal());
    String provider = authentication.getAuthorizedClientRegistrationId();
    String providerId = authentication.getName();
    UserConnectedAccount connectedAccount = new UserConnectedAccount(provider, providerId, user);
    user.addConnectedAccount(connectedAccount);
    user = userRepository.save(user);
    connectedAccountRepository.save(connectedAccount);
    return user;
  }
}
