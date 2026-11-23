package com.dreamcampus.backend.study;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {

    // 종료되지 않은(진행 중·일시정지) 세션이 있는지
    boolean existsByUserIdAndEndedAtIsNull(Long userId);

    // 종료되지 않은 세션 하나 (가장 최근 것)
    Optional<StudySession> findFirstByUserIdAndEndedAtIsNullOrderByIdDesc(Long userId);

    // 기간 안에 "시작한" 세션 (끝난 것과 진행 중인 것 모두). rangeStart 이상, rangeEnd 미만
    @Query("""
            select s from StudySession s
            where s.userId = :userId
              and s.startedAt >= :rangeStart
              and s.startedAt < :rangeEnd
            order by s.startedAt asc
            """)
    List<StudySession> findStartedBetween(@Param("userId") Long userId,
                                          @Param("rangeStart") LocalDateTime rangeStart,
                                          @Param("rangeEnd") LocalDateTime rangeEnd);
}