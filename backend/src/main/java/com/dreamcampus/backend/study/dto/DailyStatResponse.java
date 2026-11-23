package com.dreamcampus.backend.study.dto;

import java.time.LocalDate;

public record DailyStatResponse(
        LocalDate date,
        int totalSeconds,        // 그날 공부한 시간 합계 (진행 중인 세션의 지금까지 시간 포함)
        int activeSeconds,       // 그중 진행 중·일시정지 세션이 차지하는 시간
        int sessionCount,        // 그날 시작한 세션 수
        Integer goalSeconds,     // 하루 목표(초). 목표가 없으면 null
        Double achievementRate   // 달성률(%). 목표가 없으면 null
) {
}