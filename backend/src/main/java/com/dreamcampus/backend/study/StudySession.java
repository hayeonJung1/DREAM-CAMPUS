package com.dreamcampus.backend.study;

import com.dreamcampus.backend.common.exception.ApiException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_sessions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "study_subject_id")
    private Long studySubjectId;                 // 과목 없이 자유 공부면 null

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;               // 종료 전에는 null

    @Column(name = "paused_at")
    private LocalDateTime pausedAt;              // 일시정지 중일 때만 값이 있음

    @Column(name = "total_paused_seconds", nullable = false)
    private int totalPausedSeconds;              // 지금까지 쉰 시간(초)

    @Column(name = "duration_seconds", nullable = false)
    private int durationSeconds;                 // 종료 시 확정되는 순수 공부 시간(초)

    // ---------- 생성 ----------

    public static StudySession start(Long userId, Long studySubjectId, LocalDateTime now) {
        StudySession session = new StudySession();
        session.userId = userId;
        session.studySubjectId = studySubjectId;
        session.startedAt = now;
        return session;
    }

    // ---------- 상태 판단 ----------

    public SessionStatus status() {
        if (endedAt != null) return SessionStatus.ENDED;
        if (pausedAt != null) return SessionStatus.PAUSED;
        return SessionStatus.RUNNING;
    }

    // ---------- 상태 변경 ----------

    public void pause(LocalDateTime now) {
        if (endedAt != null) throw ApiException.conflict("이미 종료된 공부예요.");
        if (pausedAt != null) throw ApiException.conflict("이미 일시정지 중이에요.");
        pausedAt = now;
    }

    public void resume(LocalDateTime now) {
        if (endedAt != null) throw ApiException.conflict("이미 종료된 공부예요.");
        if (pausedAt == null) throw ApiException.conflict("일시정지 상태가 아니에요.");
        totalPausedSeconds += secondsBetween(pausedAt, now);   // 쉰 시간을 누적하고
        pausedAt = null;                                       // 다시 진행 중으로
    }

    public void stop(LocalDateTime now) {
        if (endedAt != null) throw ApiException.conflict("이미 종료된 공부예요.");
        if (pausedAt != null) resume(now);                     // 쉬는 중에 끝냈다면 쉰 시간부터 정리
        endedAt = now;
        durationSeconds = Math.max(0, secondsBetween(startedAt, now) - totalPausedSeconds);
    }

    // ---------- 경과 시간 계산 ----------

    /** 지금까지의 순수 공부 시간(초). 일시정지 중이면 멈춘 시점까지만 센다. */
    public int elapsedSeconds(LocalDateTime now) {
        if (endedAt != null) return durationSeconds;
        LocalDateTime end = (pausedAt != null) ? pausedAt : now;
        return Math.max(0, secondsBetween(startedAt, end) - totalPausedSeconds);
    }

    private static int secondsBetween(LocalDateTime from, LocalDateTime to) {
        return (int) Math.max(0, Duration.between(from, to).getSeconds());
    }
}