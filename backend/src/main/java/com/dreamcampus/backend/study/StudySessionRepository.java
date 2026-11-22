package com.dreamcampus.backend.study;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {

    // 종료되지 않은(진행 중·일시정지) 세션이 있는지
    boolean existsByUserIdAndEndedAtIsNull(Long userId);

    // 종료되지 않은 세션 하나 (가장 최근 것)
    Optional<StudySession> findFirstByUserIdAndEndedAtIsNullOrderByIdDesc(Long userId);
}