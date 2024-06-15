package com.example.backend.users.repository;

import com.example.backend.users.UserConnectedAccount;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ConnectedAccountRepository extends JpaRepository<UserConnectedAccount, Long> {
  @Query("SELECT a FROM UserConnectedAccount a WHERE a.provider = :provider AND a.providerId = :providerId")
  Optional<UserConnectedAccount> findByProviderAndProviderId(@Param("provider") String provider, @Param("providerId") String providerId);

}
