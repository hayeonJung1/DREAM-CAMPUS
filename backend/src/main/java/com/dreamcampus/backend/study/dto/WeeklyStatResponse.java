package com.dreamcampus.backend.study.dto;

import java.time.LocalDate;
import java.util.List;

public record WeeklyStatResponse(
        LocalDate startDate,     // 그 주의 월요일
        LocalDate endDate,       // 그 주의 일요일
        List<DayStat> days,      // 항상 7개 (공부하지 않은 날은 0초)
        int totalSeconds,
        int studiedDays,         // 공부한 날 수
        Integer goalSeconds,     // 하루 목표(초). 없으면 null
        Integer achievedDays     // 목표를 달성한 날 수. 목표가 없으면 null
) {
    public record DayStat(LocalDate date, String dayLabel, int totalSeconds) {
    }
}