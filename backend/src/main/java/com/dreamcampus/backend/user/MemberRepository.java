package com.dreamcampus.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    boolean existsByEmail(String email);

    java.util.List<Member> findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(String email, String name);

    long countByRole(String role);

    long countByRoleAndStatus(String role, String status);
}