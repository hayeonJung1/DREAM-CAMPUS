package com.dreamcampus.backend.study.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

// null 이면 목표 해제 (@Min, @Max 는 null 이면 검사하지 않는다)
public record StudyGoalRequest(
        @Min(value = 1, message = "목표 시간은 1분 이상으로 입력해 주세요.")
        @Max(value = 1440, message = "목표 시간은 하루(1440분)를 넘을 수 없어요.")
        Integer dailyGoalMinutes
) {
}