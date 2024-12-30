package com.example.backend.auth;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

import com.example.backend.config.ApplicationProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.function.Supplier;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.WebSecurityConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.switchuser.SwitchUserFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

  private final ApplicationProperties applicationProperties;
  private final UserDetailsService userDetailsService;
  private final Oauth2LoginSuccessHandler oauth2LoginSuccessHandler;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(customizer -> {
      customizer
          .requestMatchers(antMatcher(HttpMethod.POST, "/api/users")).permitAll()
          .requestMatchers(antMatcher(HttpMethod.GET, "/api/users/verify-email")).permitAll()
          .requestMatchers(antMatcher(HttpMethod.POST, "/api/users/forgot-password")).permitAll()
          .requestMatchers(antMatcher(HttpMethod.PATCH, "/api/users/reset-password")).permitAll()
          .requestMatchers(antMatcher(HttpMethod.POST, "/api/auth/login")).permitAll()
          .requestMatchers(antMatcher(HttpMethod.GET, "/api/auth/csrf")).permitAll()
          .requestMatchers(antMatcher(HttpMethod.GET, "/api/auth/impersonate")).hasRole("ADMIN")
          .requestMatchers(antMatcher(HttpMethod.GET, "/api/auth/impersonate/exit")).hasRole("PREVIOUS_ADMINISTRATOR")
          .requestMatchers(antMatcher(HttpMethod.GET, "/api/notifications/subscribe")).permitAll()
          .requestMatchers(antMatcher(HttpMethod.POST, "/api/notifications/delivery/**")).permitAll()
          .requestMatchers(antMatcher("/swagger-ui/**")).permitAll()
          .requestMatchers(antMatcher("/v3/api-docs/**")).permitAll()
          .requestMatchers(antMatcher("/swagger-resources/**")).permitAll()
          .requestMatchers(antMatcher("/webjars/**")).permitAll()
          .anyRequest().authenticated();
    });

    http.oauth2Login(customizer -> {
      customizer.successHandler(oauth2LoginSuccessHandler);
    });

    http.exceptionHandling(customizer -> {
      customizer.authenticationEntryPoint(
          (request, response, authException) -> {
            response.sendError(401, "Unauthorized");
          });
    });

    http.addFilterBefore(new UsernamePasswordAuthenticationFilter(), LogoutFilter.class);
    http.userDetailsService(userDetailsService);

    http.csrf(AbstractHttpConfigurer::disable); // TODO: Implement jwt token based authentication

//    http.csrf(csrf -> {
//      csrf
//          .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//          .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler());
//    }).addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class);

    http.cors(customizer -> {
      customizer.configurationSource(corsConfigurationSource());
    });

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  private CorsConfigurationSource corsConfigurationSource() {
    return new CorsConfigurationSource() {
      @Override
      public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(applicationProperties.getAllowedOrigins());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        return config;
      }
    };
  }

  @Bean
  public AuthenticationManager authenticationManager() {
    DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
    daoAuthenticationProvider.setUserDetailsService(userDetailsService);
    daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
    return new ProviderManager(daoAuthenticationProvider);
  }

  final class SpaCsrfTokenRequestHandler extends CsrfTokenRequestAttributeHandler {
    private final CsrfTokenRequestHandler delegate = new XorCsrfTokenRequestAttributeHandler();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, Supplier<CsrfToken> csrfToken) {
      /*
       * Always use XorCsrfTokenRequestAttributeHandler to provide BREACH protection of
       * the CsrfToken when it is rendered in the response body.
       */
      this.delegate.handle(request, response, csrfToken);
    }

    @Override
    public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
      /*
       * If the request contains a request header, use CsrfTokenRequestAttributeHandler
       * to resolve the CsrfToken. This applies when a single-page application includes
       * the header value automatically, which was obtained via a cookie containing the
       * raw CsrfToken.
       */
      if (StringUtils.hasText(request.getHeader(csrfToken.getHeaderName()))) {
        return super.resolveCsrfTokenValue(request, csrfToken);
      }
      /*
       * In all other cases (e.g. if the request contains a request parameter), use
       * XorCsrfTokenRequestAttributeHandler to resolve the CsrfToken. This applies
       * when a server-side rendered form includes the _csrf request parameter as a
       * hidden input.
       */
      return this.delegate.resolveCsrfTokenValue(request, csrfToken);
    }
  }

  final class CsrfCookieFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
      CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
      // Render the token value to a cookie by causing the deferred token to be loaded
      csrfToken.getToken();

      filterChain.doFilter(request, response);
    }
  }

  @Bean
  public SwitchUserFilter switchUserFilter() {
    SwitchUserFilter filter = new SwitchUserFilter();
    filter.setUserDetailsService(userDetailsService);
    filter.setSwitchUserMatcher(antMatcher(HttpMethod.GET, "/api/auth/impersonate"));
    filter.setExitUserMatcher(antMatcher(HttpMethod.GET, "/api/auth/impersonate/exit"));
    filter.setSuccessHandler((request, response, authentication) -> {
      response.sendRedirect(applicationProperties.getBaseUrl() + "/switch-success");
    });
    return filter;
  }
}