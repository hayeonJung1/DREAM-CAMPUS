package com.dreamcampus.backend.user.dto;

import com.dreamcampus.backend.user.Member;

public record AuthResponse(
        Long userId,
        String email,
        String name,
        Byte grade,
        Integer dailyGoalMinutes
) {
    public static AuthResponse from(Member member) {
        return new AuthResponse(
                member.getUserId(),
                member.getEmail(),
                member.getName(),
                member.getGrade(),
                member.getDailyGoalMinutes()
        );
    }
}