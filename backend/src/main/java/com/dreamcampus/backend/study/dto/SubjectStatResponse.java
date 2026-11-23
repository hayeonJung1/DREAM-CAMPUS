package com.dreamcampus.backend.study.dto;

public record SubjectStatResponse(
        String subjectName,   // 과목 없이 공부한 시간은 "자유 공부"
        int totalSeconds,
        int sessionCount,
        double percent        // 전체 공부 시간 중 이 과목의 비율(%)
) {
}