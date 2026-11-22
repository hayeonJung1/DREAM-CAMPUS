package com.dreamcampus.backend.study.dto;

import com.dreamcampus.backend.study.SessionStatus;
import com.dreamcampus.backend.study.StudySession;

import java.time.LocalDateTime;

public record StudySessionResponse(
        Long sessionId,
        Long studySubjectId,
        String studySubjectName,
        SessionStatus status,
        LocalDateTime startedAt,
        LocalDateTime pausedAt,
        LocalDateTime endedAt,
        int totalPausedSeconds,
        int elapsedSeconds,          // 응답을 만든 시점까지의 순수 공부 시간(초)
        LocalDateTime serverTime     // 응답을 만든 서버 시각 (화면에서 이어서 세는 기준)
) {
    public static StudySessionResponse of(StudySession s, String subjectName, LocalDateTime now) {
        return new StudySessionResponse(
                s.getId(), s.getStudySubjectId(), subjectName, s.status(),
                s.getStartedAt(), s.getPausedAt(), s.getEndedAt(),
                s.getTotalPausedSeconds(), s.elapsedSeconds(now), now);
    }
}